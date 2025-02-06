using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.servisces;
using FarmProject.hubs;
using FarmProject.hubs.services;
using FarmProject.mqtt.services;
using FarmProject.validation.services;
using MQTTnet.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddConnections();

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<PressureSensorProvider>();
builder.Services.AddTransient<PressureMeasurmentsDtoConvertService>();
builder.Services.AddTransient<PressureSettingsDtoConvertService>();
builder.Services.AddTransient<PressureSensorDtoConvertService>();
builder.Services.AddScoped<PressureValidationService>();
builder.Services.AddSignalR();
builder.Services.AddSingleton<MeasurementsHubService>();

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
    builder.WithOrigins("http://localhost:5174")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials());
}

app.MapControllers();
app.MapHub<MeasurementsHub>("/sensors/measurements/hub");

app.UseMqttServer(server =>
{
    var mqttBroker = app.Services.GetRequiredService<MqttBrokerService>();
    server.InterceptingPublishAsync += mqttBroker.InterceptingPublishAsync;
});

app.Run();
