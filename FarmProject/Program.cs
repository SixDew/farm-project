using FarmProject.alarm.services;
using FarmProject.auth;
using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.services;
using FarmProject.dto.servisces;
using FarmProject.dto.users.services;
using FarmProject.hubs;
using FarmProject.hubs.services;
using FarmProject.mqtt.services;
using FarmProject.validation.services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MQTTnet.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AuthenticationJwtOptions>(builder.Configuration.GetSection("JWT"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = AuthenticationJwtOptions.ISSUER,
        ValidAudience = AuthenticationJwtOptions.AUDIENCE,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!)),
        ClockSkew = TimeSpan.Zero
    };
});
builder.Services.AddAuthorization();
builder.Services.AddConnections();

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<PressureSensorProvider>();
builder.Services.AddScoped<UserProvider>();
builder.Services.AddTransient<UserDtoConverter>();
builder.Services.AddTransient<PressureMeasurmentsDtoConvertService>();
builder.Services.AddTransient<PressureSettingsDtoConvertService>();
builder.Services.AddTransient<PressureSensorDtoConvertService>();
builder.Services.AddScoped<PressureValidationService>();
builder.Services.AddSignalR();
builder.Services.AddSingleton<MeasurementsHubService>();
builder.Services.AddScoped<AlarmPressureMeasurementsChecker>();
builder.Services.AddTransient<PressureAlarmDtoConvertService>();
builder.Services.AddScoped<AlarmPressureSensorService>();

builder.Services.AddMqttConnectionHandler();
builder.Services.AddHostedMqttServer(OptionsBuilder =>
{
    OptionsBuilder.WithDefaultEndpoint();
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MqttBrokerService>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(1883, listenOptions =>
    {
        listenOptions.UseMqtt();
    });

    options.ListenLocalhost(7061, op =>
    {
        op.UseHttps();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(builder =>
    builder.WithOrigins("http://localhost:5173")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials());
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<MeasurementsHub>("/sensors/measurements/hub");

app.UseMqttServer(server =>
{
    var mqttBroker = app.Services.GetRequiredService<MqttBrokerService>();
    server.InterceptingPublishAsync += mqttBroker.InterceptingPublishAsync;
    server.ValidatingConnectionAsync += mqttBroker.ValidateEvent;
    server.ClientConnectedAsync += mqttBroker.ConnectedEvent;
});

app.Run();
