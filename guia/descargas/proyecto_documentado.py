# =============================================================================
# PROYECTO: Dashboard Analítico - Minimarket
# AUTOR: Deyvid Torrez
# INSTITUCIÓN: Cesbol Ingeniería
# DESCRIPCIÓN: Aplicación de escritorio para gestionar y analizar productos
#              de un minimarket usando Tkinter, JSON, Pandas y Matplotlib.
# =============================================================================

# -----------------------------------------------------------------------------
# SECCIÓN 1: IMPORTACIÓN DE LIBRERÍAS
# -----------------------------------------------------------------------------
# Para instalar las librerías necesarias, ejecuta en tu terminal:
#
#   pip install pandas matplotlib openpyxl
#
# Librerías que ya vienen incluidas con Python (no necesitan instalación):
#   - tkinter   → Para crear la interfaz gráfica (ventanas, botones, tablas)
#   - json      → Para leer y guardar datos en formato JSON
#   - os        → Para manejar rutas de archivos del sistema
#   - sys       → Para detectar si el programa corre como .exe o script .py
#   - datetime  → Para obtener la fecha y hora actual

import tkinter as tk
from tkinter import messagebox  # Cuadros de diálogo (info, error, advertencia)
from tkinter import ttk          # Widgets mejorados (Treeview para la tabla)
import json                      # Lectura y escritura de archivos JSON
import pandas as pd              # Manipulación de datos y exportación a Excel
import matplotlib.pyplot as plt  # Generación de gráficas y visualizaciones
from datetime import datetime    # Fecha y hora para nombrar archivos exportados
import os                        # Manejo de rutas del sistema operativo
import sys                       # Información sobre el entorno de ejecución

# -----------------------------------------------------------------------------
# SECCIÓN 2: CONFIGURACIÓN DE RUTAS
# -----------------------------------------------------------------------------
# Esta lógica detecta si el programa fue compilado como .exe (con PyInstaller)
# o si se está ejecutando como script .py normal.
#
# - sys.frozen → True si fue compilado con PyInstaller
# - sys.executable → Ruta del ejecutable (.exe)
# - __file__ → Ruta del script actual (.py)
#
# Esto garantiza que el archivo JSON siempre se busque en la misma carpeta
# que el programa, sin importar desde dónde se ejecute.

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)  # Modo .exe compilado
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Modo script .py

# Ruta completa al archivo de datos JSON
RUTA_JSON = os.path.join(BASE_DIR, "productos_minimarket.json")

# -----------------------------------------------------------------------------
# SECCIÓN 3: FUNCIONES DE LÓGICA Y DATOS
# -----------------------------------------------------------------------------

def actualizar_dashboard():
    """
    Recalcula y actualiza las 4 tarjetas del panel superior:
    - Total de productos cargados
    - Suma total de precios
    - Precio promedio
    - Producto más caro

    Se llama automáticamente cada vez que se agrega, edita o elimina un producto.
    """
    filas = tabla.get_children()  # Obtiene todas las filas de la tabla

    # Si no hay filas, resetea todos los valores a su estado vacío
    if not filas:
        total_productos.set("0")
        valor_total.set("Bs 0.00")
        promedio.set("Bs 0.00")
        mas_caro.set("N/A")
        return

    precios = []   # Lista de precios numéricos
    nombres = []   # Lista de tuplas (nombre, precio)

    for fila in filas:
        valores = tabla.item(fila)["values"]  # Obtiene (id, nombre, precio) de cada fila

        # Limpia el texto del precio: "Bs12.50" → 12.50
        precio = float(str(valores[2]).replace("Bs", "").strip())

        precios.append(precio)
        nombres.append((valores[1], precio))

    # Actualiza las variables de las tarjetas del dashboard
    total_productos.set(str(len(precios)))
    valor_total.set(f"Bs {sum(precios):.2f}")
    promedio.set(f"Bs {sum(precios)/len(precios):.2f}")

    # Encuentra el producto con el precio más alto usando max() con key
    producto_caro = max(nombres, key=lambda x: x[1])
    mas_caro.set(f"{producto_caro[0]} (Bs {producto_caro[1]:.2f})")


def descargar_datos():
    """
    Carga los productos desde el archivo JSON local al Treeview (tabla).

    Flujo:
    1. Abre y lee el archivo JSON
    2. Limpia la tabla actual
    3. Inserta cada producto como una fila
    4. Actualiza el dashboard

    En una versión con API real, aquí se haría la petición HTTP con requests.get()
    """
    try:
        # Abre el archivo JSON con codificación UTF-8 (soporta tildes y ñ)
        with open(RUTA_JSON, "r", encoding="utf-8") as archivo:
            datos_json = json.load(archivo)  # Convierte el JSON a lista de diccionarios

        # Elimina todas las filas existentes antes de recargar
        for fila in tabla.get_children():
            tabla.delete(fila)

        # Inserta cada producto como nueva fila al final de la tabla (tk.END)
        for item in datos_json:
            tabla.insert("", tk.END, values=(item["id"], item["title"], f"Bs{item['price']:.2f}"))

        actualizar_dashboard()
        messagebox.showinfo("Éxito", "¡Catálogo cargado!")
    except Exception as e:
        messagebox.showerror("Error", str(e))


def guardar_json():
    """
    Guarda todos los productos actuales de la tabla en el archivo JSON.

    Se llama automáticamente después de agregar, editar o eliminar un producto,
    asegurando que los datos en disco estén siempre sincronizados con la tabla.
    """
    datos = []

    # Recorre cada fila de la tabla y construye la lista de diccionarios
    for fila in tabla.get_children():
        valores = tabla.item(fila)["values"]

        datos.append({
            "id": int(valores[0]),
            "title": valores[1],
            "price": float(str(valores[2]).replace("Bs", "").strip())
        })

    # Escribe el JSON con indentación de 4 espacios y soporte para caracteres especiales
    with open(RUTA_JSON, "w", encoding="utf-8") as archivo:
        json.dump(datos, archivo, indent=4, ensure_ascii=False)


def generar_id():
    """
    Genera un ID único y auto-incremental para un nuevo producto.

    Lógica:
    - Obtiene todos los IDs actuales de la tabla
    - Retorna el máximo + 1
    - Si la tabla está vacía, retorna 1

    Retorna:
        int: El siguiente ID disponible
    """
    ids = []
    for fila in tabla.get_children():
        valores = tabla.item(fila)["values"]
        ids.append(int(valores[0]))

    return max(ids) + 1 if ids else 1


def agregar_producto():
    """
    Agrega un nuevo producto a la tabla y lo guarda en el JSON.

    Validaciones:
    - Los campos nombre y precio no deben estar vacíos
    - El precio debe ser un número válido (float)

    Si todo es correcto:
    1. Genera un nuevo ID automáticamente
    2. Inserta la fila en la tabla
    3. Guarda en JSON
    4. Actualiza el dashboard
    5. Limpia los campos de entrada
    """
    nombre = entry_nombre.get()
    precio = entry_precio.get()

    # Validación: campos vacíos
    if not nombre or not precio:
        messagebox.showwarning("Aviso", "Completa todos los campos")
        return

    # Validación: precio debe ser numérico
    try:
        precio = float(precio)
    except:
        messagebox.showerror("Error", "Precio inválido")
        return

    id = generar_id()

    # Inserta la nueva fila al final de la tabla
    tabla.insert("", tk.END, values=(id, nombre, f"Bs{precio:.2f}"))
    guardar_json()
    actualizar_dashboard()
    limpiar_inputs()


def editar_producto():
    """
    Edita el producto seleccionado en la tabla con los datos de los campos de entrada.

    Requisitos:
    - Debe haber una fila seleccionada en la tabla
    - Todos los campos (ID, nombre, precio) deben estar completos
    - El precio debe ser un número válido

    Nota: El ID puede editarse manualmente desde el campo de entrada.
    """
    seleccion = tabla.selection()  # Obtiene la fila seleccionada actualmente

    if not seleccion:
        messagebox.showwarning("Aviso", "Selecciona un producto")
        return

    id = entry_id.get()
    nombre = entry_nombre.get()
    precio = entry_precio.get()

    if not id or not nombre or not precio:
        messagebox.showwarning("Aviso", "Completa todos los campos")
        return

    try:
        precio = float(precio)
    except:
        messagebox.showerror("Error", "Precio inválido")
        return

    # Actualiza los valores de la fila seleccionada sin crear una nueva
    tabla.item(seleccion[0], values=(id, nombre, f"Bs{precio:.2f}"))
    guardar_json()
    actualizar_dashboard()
    limpiar_inputs()


def eliminar_producto():
    """
    Elimina el producto seleccionado de la tabla y actualiza el JSON.

    Si no hay ninguna fila seleccionada, muestra una advertencia.
    La eliminación es permanente (no hay confirmación adicional).
    """
    seleccion = tabla.selection()

    if not seleccion:
        messagebox.showwarning("Aviso", "Selecciona un producto")
        return

    tabla.delete(seleccion[0])  # Elimina la fila del Treeview
    guardar_json()
    actualizar_dashboard()


def seleccionar_fila(event):
    """
    Evento que se dispara al hacer clic en una fila de la tabla.

    Carga automáticamente los datos del producto seleccionado
    en los campos de entrada (ID, Nombre, Precio) para facilitar
    la edición sin tener que escribir manualmente.

    Parámetro:
        event: Evento de clic del mouse (enviado automáticamente por Tkinter)
    """
    seleccion = tabla.selection()

    if seleccion:
        valores = tabla.item(seleccion[0])["values"]

        # Limpia los campos antes de rellenarlos
        entry_id.delete(0, tk.END)
        entry_nombre.delete(0, tk.END)
        entry_precio.delete(0, tk.END)

        # Rellena cada campo con el valor correspondiente de la fila
        entry_id.insert(0, valores[0])
        entry_nombre.insert(0, valores[1])
        entry_precio.insert(0, str(valores[2]).replace("Bs", "").strip())


def limpiar_inputs():
    """
    Limpia el contenido de los tres campos de entrada (ID, Nombre, Precio).
    Se llama después de agregar o editar un producto exitosamente.
    """
    entry_id.delete(0, tk.END)
    entry_nombre.delete(0, tk.END)
    entry_precio.delete(0, tk.END)


def exportar_excel():
    """
    Exporta todos los productos de la tabla a un archivo Excel (.xlsx).

    Usa la librería Pandas para crear el DataFrame y guardarlo.
    El nombre del archivo incluye la fecha y hora actual para evitar sobreescrituras.

    Ejemplo de nombre generado: Reporte_20240615_143022.xlsx

    Requiere: pip install pandas openpyxl
    """
    filas = tabla.get_children()

    if not filas:
        messagebox.showwarning("Aviso", "No hay datos")
        return

    # Extrae los valores de cada fila como lista de listas
    datos = [tabla.item(f)["values"] for f in filas]

    # Crea un DataFrame de Pandas con columnas nombradas
    df = pd.DataFrame(datos, columns=["ID", "Producto", "Precio (BOB)"])

    # Nombre del archivo con timestamp para hacerlo único
    nombre = f"Reporte_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"

    try:
        df.to_excel(nombre, index=False)  # index=False evita columna extra de índice
        messagebox.showinfo("Éxito", "Excel generado")
    except Exception as e:
        messagebox.showerror("Error", str(e))


def mostrar_graficos():
    """
    Genera y muestra una gráfica de barras horizontales con los
    10 productos más caros del catálogo actual.

    Pasos:
    1. Extrae los datos de la tabla
    2. Ordena por precio de mayor a menor
    3. Toma solo los primeros 10
    4. Trunca nombres largos a 15 caracteres para mejor visualización
    5. Dibuja la gráfica con Matplotlib

    Requiere: pip install matplotlib
    """
    filas = tabla.get_children()

    if not filas:
        messagebox.showwarning("Aviso", "No hay datos")
        return

    datos = []

    for fila in filas:
        valores = tabla.item(fila)["values"]

        nombre = str(valores[1])
        precio = float(str(valores[2]).replace("Bs", "").strip())

        datos.append((nombre, precio))

    # Ordena de mayor a menor precio (reverse=True)
    datos.sort(key=lambda x: x[1], reverse=True)

    # Solo los 10 más caros
    top_10 = datos[:10]

    nombres = []
    precios = []

    for nombre, precio in top_10:
        # Trunca nombres largos para que quepan en el eje Y
        if len(nombre) > 15:
            nombre = nombre[:15] + "..."

        nombres.append(nombre)
        precios.append(precio)

    # Configuración de la figura de Matplotlib
    plt.figure(figsize=(10, 6))                          # Tamaño en pulgadas
    plt.barh(nombres, precios, color="#8b5cf6")           # Barras horizontales color violeta

    plt.xlabel("Precio en Bolivianos (BOB)")
    plt.title("Top 10 Productos Más Caros")

    plt.gca().invert_yaxis()  # El más caro aparece arriba (primer lugar)

    plt.tight_layout()  # Ajusta márgenes automáticamente para evitar recortes
    plt.show()          # Abre la ventana de la gráfica


# -----------------------------------------------------------------------------
# SECCIÓN 4: CONSTRUCCIÓN DE LA INTERFAZ GRÁFICA (GUI)
# -----------------------------------------------------------------------------
# A partir de aquí se crea y configura la ventana principal y todos sus elementos.
# El orden importa: los widgets deben crearse antes de ser referenciados.

# --- Ventana principal ---
ventana = tk.Tk()
ventana.title("Dashboard Analítico")
ventana.geometry("900x650")        # Ancho x Alto en píxeles
ventana.configure(bg="#f3f4f6")    # Color de fondo gris claro

# --- Variables de control para las tarjetas del dashboard ---
# StringVar permite actualizar el texto de un Label automáticamente
# al cambiar el valor de la variable con .set()
total_productos = tk.StringVar(ventana)
valor_total     = tk.StringVar(ventana)
promedio        = tk.StringVar(ventana)
mas_caro        = tk.StringVar(ventana)

# --- Encabezado / Header ---
frame_header = tk.Frame(ventana, bg="#ffffff", pady=15)
frame_header.pack(fill=tk.X)  # Ocupa todo el ancho de la ventana

tk.Label(frame_header, text="Analizador de Mercado",
         font=("Segoe UI", 20, "bold"), bg="#ffffff", fg="#1e293b").pack()
tk.Label(frame_header, text="Modulo 1: Interfaz Visual",
         font=("Segoe UI", 11), bg="#ffffff", fg="#64748b").pack()

# --- Panel de tarjetas (Dashboard) ---
frame_dashboard = tk.Frame(ventana, bg="#f3f4f6")
frame_dashboard.pack(pady=10)

def crear_card(parent, titulo, variable, color):
    """
    Función auxiliar para crear una tarjeta de estadística.

    Parámetros:
        parent   : Frame contenedor donde se colocará la tarjeta
        titulo   : Texto descriptivo de la métrica (ej. "Productos")
        variable : StringVar cuyo valor se mostrará en la tarjeta
        color    : Color hexadecimal para el valor numérico
    """
    frame = tk.Frame(parent, bg="white", padx=15, pady=10, bd=1, relief="solid")
    frame.pack(side=tk.LEFT, padx=10)  # Se colocan una al lado de la otra

    tk.Label(frame, text=titulo,
             font=("Segoe UI", 10), bg="white", fg="#64748b").pack()

    # textvariable enlaza el Label a la StringVar: se actualiza automáticamente
    tk.Label(frame, textvariable=variable,
             font=("Segoe UI", 14, "bold"), bg="white", fg=color).pack()

# Creación de las 4 tarjetas del dashboard con sus colores distintivos
crear_card(frame_dashboard, "Productos",   total_productos, "#0284c7")  # Azul
crear_card(frame_dashboard, "Valor Total", valor_total,     "#16a34a")  # Verde
crear_card(frame_dashboard, "Promedio",    promedio,        "#7c3aed")  # Violeta
crear_card(frame_dashboard, "Más caro",   mas_caro,        "#dc2626")  # Rojo

# --- Botones de acciones principales ---
frame_controles = tk.Frame(ventana, bg="#f3f4f6")
frame_controles.pack(pady=20)

# Fila 0: Acciones globales
tk.Button(frame_controles, text="☁️ Descargar Json", command=descargar_datos,
          bg="#0284c7", fg="white", width=20).grid(row=0, column=0, padx=10)
tk.Button(frame_controles, text="📊 Exportar Excel", command=exportar_excel,
          bg="#10b981", fg="white", width=20).grid(row=0, column=1, padx=10)
tk.Button(frame_controles, text="📈 Ver Grafica", command=mostrar_graficos,
          bg="#8b5cf6", fg="white", width=20).grid(row=0, column=2, padx=10)

# --- Campos de entrada para gestión de productos ---
frame_inputs = tk.Frame(ventana, bg="#f3f4f6")
frame_inputs.pack(pady=10)

tk.Label(frame_inputs, text="ID").grid(row=0, column=0)
entry_id = tk.Entry(frame_inputs)
entry_id.grid(row=0, column=1)

tk.Label(frame_inputs, text="Nombre").grid(row=0, column=2)
entry_nombre = tk.Entry(frame_inputs)
entry_nombre.grid(row=0, column=3)

tk.Label(frame_inputs, text="Precio").grid(row=0, column=4)
entry_precio = tk.Entry(frame_inputs)
entry_precio.grid(row=0, column=5)

# Fila 1: Acciones CRUD (Crear, Editar, Eliminar)
tk.Button(frame_controles, text="➕ Agregar", command=agregar_producto).grid(row=1, column=0, pady=10)
tk.Button(frame_controles, text="✏️ Editar",  command=editar_producto).grid(row=1, column=1)
tk.Button(frame_controles, text="❌ Eliminar", command=eliminar_producto).grid(row=1, column=2)

# --- Tabla de productos (Treeview) ---
frame_tabla = tk.Frame(ventana, bg="#f3f4f6")
frame_tabla.pack(fill=tk.BOTH, expand=True, padx=30, pady=(0, 20))

# Treeview: widget tipo tabla con columnas personalizadas
# show="headings" oculta la columna de icono de árbol (primera columna por defecto)
tabla = ttk.Treeview(frame_tabla, columns=("ID", "Producto", "Precio"), show="headings")

# Configura el texto del encabezado de cada columna
tabla.heading("ID",      text="ID")
tabla.heading("Producto", text="Nombre del Producto")
tabla.heading("Precio",  text="Precio (BOB)")

tabla.pack(fill=tk.BOTH, expand=True)

# Vincula el evento de clic en la tabla a la función seleccionar_fila
# ButtonRelease-1 = soltar el botón izquierdo del mouse
tabla.bind("<ButtonRelease-1>", seleccionar_fila)

# -----------------------------------------------------------------------------
# SECCIÓN 5: INICIALIZACIÓN Y LOOP PRINCIPAL
# -----------------------------------------------------------------------------

# Carga inicial del dashboard con valores vacíos (tabla aún sin datos)
actualizar_dashboard()

# Inicia el loop de eventos de Tkinter.
# El programa se queda aquí hasta que el usuario cierre la ventana.
ventana.mainloop()