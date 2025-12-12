using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SiSProI.Data;
using SSP.Data;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// 1. Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // Esta es la ruta a tu página de login. El sistema redirigirá aquí.
        options.LoginPath = "/Login";

        // (Opcional) Ruta para cerrar sesión
        options.LogoutPath = "/Login";

        // (Opcional) Ruta si un usuario está logueado pero no tiene permiso
        options.AccessDeniedPath = "/Login";

        options.ExpireTimeSpan = TimeSpan.FromMinutes(30); // Duración de la cookie

        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.Redirect(options.AccessDeniedPath);
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Política para "Admin": Requiere el claim ("permiso", "admin")
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireClaim("permiso", "admin"));

    // Política para "Sprfm": Requiere el claim ("permiso", "sprfm")
    options.AddPolicy("SprfmPolicy", policy =>
        policy.RequireClaim("permiso", "sprfm"));

    // Política para "Siisu": Requiere el claim ("permiso", "siisu")
    options.AddPolicy("SiisuPolicy", policy =>
        policy.RequireClaim("permiso", "siisu"));

    // Política "O": Requiere "sprfm" O "siisu"
    options.AddPolicy("ModulosPolicy", policy =>
        policy.RequireClaim("permiso", "sprfm", "siisu"));
});

builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<IPasswordHasher<MoUsuario>, PasswordHasher<MoUsuario>>();

// En Program.cs, junto con tus otros servicios
builder.Services.AddScoped<DaLogin, UserService>();
builder.Services.AddScoped<DaEmpleado>();
builder.Services.AddScoped<DaSolicitud>();
//builder.Services.AddScoped<DaEmpleado, DaSolicitud>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
