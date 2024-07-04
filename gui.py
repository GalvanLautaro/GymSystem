import tkinter as tk
from tkinter import messagebox
import pandas as pd
from exercise_generator import randomize_exercises
from pdf_creator import create_pdf

class GymApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Rutinas de Gimnasio")
        
        self.exercises = {
            'Categoria': ['Empuje', 'Empuje', 'Empuje', 'Tirón', 'Tirón', 'Tirón', 'Piernas', 'Piernas', 'Piernas'],
            'Ejercicio': ['Press de banca', 'Press militar', 'Fondos', 'Dominadas', 'Remo con barra', 'Face pulls', 'Sentadillas', 'Peso muerto', 'Zancadas']
        }
        
        self.create_widgets()
    
    def create_widgets(self):
        # Etiqueta y entrada para el número de ejercicios por categoría
        self.label = tk.Label(self.root, text="Número de ejercicios por categoría:")
        self.label.pack(pady=10)
        
        self.num_entry = tk.Entry(self.root)
        self.num_entry.pack(pady=5)
        
        # Botón para generar la rutina
        self.generate_button = tk.Button(self.root, text="Generar Rutina", command=self.generate_routine)
        self.generate_button.pack(pady=20)
        
    def generate_routine(self):
        try:
            num_per_category = int(self.num_entry.get())
            if num_per_category < 1:
                raise ValueError("El número debe ser mayor que 0")
            
            randomized_df = randomize_exercises(self.exercises, num_per_category)
            create_pdf(randomized_df, filename='routine.pdf')
            messagebox.showinfo("Éxito", "La rutina ha sido generada y guardada en 'routine.pdf'")
        except ValueError as e:
            messagebox.showerror("Error", str(e))
        except Exception as e:
            messagebox.showerror("Error", f"Ha ocurrido un error: {str(e)}")

def main():
    root = tk.Tk()
    app = GymApp(root)
    root.mainloop()

if __name__ == '__main__':
    main()