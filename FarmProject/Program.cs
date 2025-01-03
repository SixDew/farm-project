using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.servisces;
using FarmProject.validation.services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<PressureSensorProvider>();
builder.Services.AddTransient<PressureMeasurmentsDtoConvertService>();
builder.Services.AddScoped<PressureValidationService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
