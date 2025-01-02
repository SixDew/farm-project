using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.servisces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<PressureSensorProvider>();
builder.Services.AddTransient<PressureMeasurmentsDtoConvertService>();
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
