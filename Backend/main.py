from flask import Flask, request, jsonify
import json
import pymysql
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
#Antes de correr los scripts .py, instalar las librerías necesarias con el comando pip install -r requirements.txt


def db_connection():
    conn = None
    try:
        #aqui parece que se tiene que modificar como en env pero no, dejalo tal cual
        conn = pymysql.connect(
            host=os.getenv("DB_HOST"),        
            user=os.getenv("DB_USER"),        
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),    
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
    except pymysql.MySQLError as e:
        print(f"Error de conexión con la BD: {e}")
    return conn

@app.route('/')
def index():
    return jsonify({"message": "Bienvenido a la API de Alumnos y Carreras"}), 200


@app.route('/carreras', methods=['GET', 'POST'])
def all_carreras():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Erro de conexión con la BD"}), 500
    #Importante poblar la base de datos con los scripts .sql que hay en la carpeta de Backend
    cursor = conn.cursor()
    
    if request.method == 'GET':
        try:
            
            cursor.execute("SELECT * FROM carreras")
            all_carreras = [
                dict(
                    idCarrera=row['idCarrera'],
                    carrera=row['carrera'],
                    descripcionCarrera=row['descripcionCarrera'],
                    semestres=row['semestres'],
                    plan=row['plan']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_carreras), 200
        except Exception as e:
            print(f"Error fetching carreras: {e}")
            return jsonify({"error": "Error al escribir en carreras"}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO carreras (carrera, descripcionCarrera, semestres, plan)
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['carrera'],
                data['descripcionCarrera'],
                int(data['semestres']),
                int(data['plan'])
            ))
            conn.commit()
            return jsonify({"message": "Carrera creada exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating carrera: {e}")
            return jsonify({"error": "Erro al crear carrera"}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/carreras/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_carrera(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM carreras WHERE idCarrera=%s", (id,))
            carrera = cursor.fetchone()
            if carrera:
                return jsonify(carrera), 200
            return jsonify({"error": "Carrera no encontrada"}), 404
        except Exception as e:
            print(f"Error fetching carrera: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE carreras 
                     SET carrera=%s,
                         descripcionCarrera=%s,
                         semestres=%s,
                         plan=%s
                     WHERE idCarrera=%s"""
            
            cursor.execute(sql, (
                data['carrera'],
                data['descripcionCarrera'],
                int(data['semestres']),
                int(data['plan']),
                id
            ))
            conn.commit()
            return jsonify({"message": "Carrera actualizada exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating carrera: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM carreras WHERE idCarrera=%s", (id,))
            conn.commit()
            return jsonify({"message": f"Carrera eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting carrera: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/alumnos', methods=['GET', 'POST'])
def all_alumnos():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con BD"}), 500

    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM alumnos")
            all_alumnos = [
                dict(
                    idAlumno=row['idAlumno'],
                    nombre=row['nombre'],
                    carrera=row['carrera'],
                    semestre=row['semestre'],
                    boleta=row['boleta']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_alumnos), 200
        except Exception as e:
            print(f"Error fetching alumnos: {e}")
            return jsonify({"error": "Error al escribir alumnos"}), 500
        finally:
            conn.close()  # Cierra la conexión

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO alumnos (nombre, carrera, semestre, boleta)
                    VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['nombre'],
                data['carrera'],
                int(data['semestre']),
                data['boleta']
            ))
            conn.commit()
            return jsonify({"message": "Alumno creado exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating alumno: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/alumnos/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_alumno(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM alumnos WHERE idAlumno=%s", (id,))
            alumno = cursor.fetchone()
            if alumno:
                return jsonify(alumno), 200
            return jsonify({"error": "Alumno no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching alumno: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE alumnos
                     SET nombre=%s,
                         carrera=%s,
                         semestre=%s,
                         boleta=%s
                     WHERE idAlumno=%s"""
            
            cursor.execute(sql, (
                data['nombre'],
                data['carrera'],
                int(data['semestre']),
                data['boleta'],
                id
            ))
            conn.commit()
            return jsonify({"message": "Alumno actualizado exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating alumno: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM alumnos WHERE idAlumno=%s", (id,))
            conn.commit()
            return jsonify({"message": "Alumno eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting alumno: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/grupos', methods=['GET', 'POST'])
def all_grupos():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500
    cursor = conn.cursor()
    
    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM grupos")
            all_grupos = [
                dict(
                    idGrupo=row['idGrupo'],
                    nombreGrupo=row['nombreGrupo'],
                    idCarrera=row['idCarrera'],
                    semestre=row['semestre']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_grupos), 200
        except Exception as e:
            print(f"Error fetching grupos: {e}")
            return jsonify({"error": "Error al obtener grupos"}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreGrupo', 'idCarrera', 'semestre']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO grupos (nombreGrupo, idCarrera, semestre)
                     VALUES (%s, %s, %s)"""
            cursor.execute(sql, (
                data['nombreGrupo'],
                int(data['idCarrera']),
                int(data['semestre'])
            ))
            conn.commit()
            return jsonify({"message": "Grupo creado exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating grupo: {e}")
            return jsonify({"error": "Error al crear grupo"}), 500
        finally:
            conn.close()


@app.route('/grupos/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_grupos(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con la BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM grupos WHERE idGrupo=%s", (id,))
            grupo = cursor.fetchone()
            if grupo:
                return jsonify(grupo), 200
            return jsonify({"error": "Grupo no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching grupo: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreGrupo', 'idCarrera', 'semestre']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE grupos 
                     SET nombreGrupo=%s,
                         idCarrera=%s,
                         semestre=%s
                     WHERE idGrupo=%s"""
            
            cursor.execute(sql, (
                data['nombreGrupo'],
                int(data['idCarrera']),
                int(data['semestre']),
                id
            ))

            conn.commit()
            return jsonify({"message": "Grupo actualizado exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating grupo: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM grupos WHERE idGrupo=%s", (id,))
            conn.commit()
            return jsonify({"message": f"Grupo eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting grupo: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()
#Materias
@app.route('/materias', methods=['GET', 'POST'])
def all_materias():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Erro de conexión con la BD"}), 500
    #Importante poblar la base de datos con los scripts .sql que hay en la carpeta de Backend
    cursor = conn.cursor()
    
    if request.method == 'GET':
        try:
            
            cursor.execute("SELECT * FROM materias")
            all_materias = [
                dict(
                    idMateria=row['idMateria'],
                    nombreMateria=row['nombreMateria'],
                    creditos=row['creditos'],
                    semestre=row['semestre'],
                    idCarrera=row['idCarrera']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_materias), 200
        except Exception as e:
            print(f"Error fetching carreras: {e}")
            return jsonify({"error": "Error al escribir en materias"}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreMateria', 'creditos', 'semestre', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO materias (nombreMateria, creditos, semestre, idCarrera)
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['nombreMateria'],
                int(data['creditos']),
                int(data['semestre']),
                int(data['idCarrera'])
            ))
            conn.commit()
            return jsonify({"message": "Materia creada exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating Materia: {e}")
            return jsonify({"error": "Erro al crear Materia"}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/materias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_materias(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM materias WHERE idMateria=%s", (id,))
            materia = cursor.fetchone()
            if materia:
                return jsonify(materia), 200
            return jsonify({"error": "Materia no encontrada"}), 404
        except Exception as e:
            print(f"Error fetching Materia: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreMateria', 'creditos', 'semestre', 'idCarrera']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE materias 
                     SET nombreMateria=%s,
                         creditos=%s,
                         semestre=%s,
                         idCarrera=%s
                     WHERE idMateria=%s"""
            
            cursor.execute(sql, (
                data['nombreMateria'],
                int(data['creditos']),
                int(data['semestre']),
                int(data['idCarrera']),
                id
            ))
            conn.commit()
            return jsonify({"message": "Materia actualizada exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating carrera: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM materias WHERE idMateria=%s", (id,))
            conn.commit()
            return jsonify({"message": f"Materia eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting materia: {e}")
            return jsonify({"error": str(e)}), 500
#Profesores

@app.route('/profesores', methods=['GET', 'POST'])
def all_profesor():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Erro de conexión con la BD"}), 500
    #Importante poblar la base de datos con los scripts .sql que hay en la carpeta de Backend
    cursor = conn.cursor()
    
    if request.method == 'GET':
        try:
            
            cursor.execute("SELECT * FROM profesores")
            all_profesor = [
                dict(
                    idProfesor=row['idProfesor'],
                    nombreProfesor=row['nombreProfesor'],
                    titulo=row['titulo'],
                    especialidad=row['especialidad'],
                    telefono=row['telefono']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_profesor), 200
        except Exception as e:
            print(f"Error fetching profesores: {e}")
            return jsonify({"error": "Error al escribir en profesores"}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreProfesor', 'titulo', 'especialidad', 'telefono']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO profesores (nombreProfesor, titulo, especialidad, telefono)
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['nombreProfesor'],
                data['titulo'],
                data['especialidad'],
                data['telefono']
            ))
            conn.commit()
            return jsonify({"message": "Profesor creada exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating Profesor: {e}")
            return jsonify({"error": "Erro al crear Materia"}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/profesores/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_profesor(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM profesores WHERE idProfesor=%s", (id,))
            profesores = cursor.fetchone()
            if profesores:
                return jsonify(profesores), 200
            return jsonify({"error": "Profesor no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching Materia: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombreProfesor', 'titulo', 'especialidad', 'telefono']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE profesores 
                     SET nombreProfesor=%s,
                         titulo=%s,
                         especialidad=%s,
                         telefono=%s
                     WHERE idProfesor=%s"""
            
            cursor.execute(sql, (
                data['nombreProfesor'],
                data['titulo'],
                data['especialidad'],
                data['telefono'],
                id
            ))
            conn.commit()
            return jsonify({"message": "Profesor actualizada exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating profesor: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM profesores WHERE idProfesor=%s", (id,))
            conn.commit()
            return jsonify({"message": f"Profesores eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting Profesores: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    