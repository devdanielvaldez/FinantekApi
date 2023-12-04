-- Active: 1700703363440@@127.0.0.1@3306@finantek_dev
create database finantek_dev;

use finantek_dev;

-- Creacion de tablas persona, direcciones y contactos --  

create table persona (
	persona_id int auto_increment primary key,
    nombre varchar(50) not null,
    segundo_nombre varchar(50) null,
    primer_apellido varchar(50) not null,
    segundo_apellido varchar(50) null,
    fecha_nacimiento date not null,
    sexo char not null,
    estado char not null default 'a'
);

create table direcciones (
	direccion_id int auto_increment primary key,
    provincia_id int not null,
    municipio_id int not null,
    direccion varchar(150) not null,
    codigo_postal varchar(6) null,
    referencia varchar(150) not null
);

create table contactos (
	contacto_id int auto_increment primary key,
    telefono varchar(11) null,
    movil varchar(11) null,
    telefono_oficina varchar(11) null,
    correo_electronico varchar(11) null
);

-- Insercion de nuevos campos y relaciones en las tablas persona, contactos y direcciones --  

alter table persona
add column direccion_id int;

alter table persona
add constraint fk_persona_direccion
foreign key (direccion_id)
references direcciones(direccion_id);

alter table contactos
add column persona_id int;

alter table contactos
add constraint fk_contactos_persona
foreign key (persona_id)
references persona(persona_id);

-- Creacion de tablas empresas --

create table empresas (
	emp_id int auto_increment primary key,
    nombre_completo varchar(150) not null,
    nombre_corto varchar(60) null,
    rnc varchar(11) not null,
    website varchar(50) null,
    direccion_id int not null
);

alter table empresas
add constraint fk_emp_direccion
foreign key (direccion_id)
references direcciones(direccion_id);

alter table contactos
add column emp_id int;

alter table contactos
add constraint fk_contactos_emp
foreign key (emp_id)
references empresas(emp_id);

create table users (
	user_id int auto_increment primary key,
    username varchar(11) not null,
    pwd varchar(150) not null,
    last_login datetime null,
    first_login boolean not null default true,
    recovery_code varchar(6) null,
    failed_attempts int null default 0
);

alter table persona
add column cedula varchar(11) not null;

alter table users
add column persona_id int;

alter table users
add column roll_id int not null;

alter table users
add constraint fk_persona_user
foreign key (persona_id)
references persona(persona_id);

SELECT 
    p.persona_id,
    p.nombre,
    p.segundo_nombre,
    p.primer_apellido,
    p.segundo_apellido,
    p.fecha_nacimiento,
    p.sexo,
    p.estado,
    d.direccion_id,
    d.provincia_id,
    d.municipio_id,
    d.direccion,
    d.codigo_postal,
    d.referencia,
    c.contacto_id,
    c.telefono,
    c.movil,
    c.telefono_oficina,
    c.correo_electronico
FROM persona p
LEFT JOIN direcciones d ON p.direccion_id = d.direccion_id
LEFT JOIN contactos c ON p.persona_id = c.persona_id WHERE cedula = '40211642604';

CREATE TABLE empleados (
    empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    fecha_inicio_contrato DATE NOT NULL,
    supervisor_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (persona_id) REFERENCES persona(persona_id),
    FOREIGN KEY (supervisor_id) REFERENCES empleados(empleado_id)
);

alter table empleados
add column empresa_id int not null;

CREATE TABLE dias_libres (
    dia_libre_id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    tipo ENUM('Dia Libre', 'Vacaciones', 'Licencia') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    aprobado BOOLEAN NOT NULL DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

CREATE TABLE roles (
	rol_id INT auto_increment primary key,
    descripcion_rol varchar(150) not null
);

alter table roles
add column rol_id_system int not null;

alter table dias_libres
modify tipo ENUM('D_L', 'V', 'L') NOT NULL;

select * from empleados;

alter table empleados
add column estado enum('A', 'S', 'C', 'V');

alter table empleados
modify estado enum('A', 'S', 'C', 'V') default 'A';

CREATE TABLE noticias (
    noticia_id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    persona_id INT NOT NULL,
    fecha_publicacion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(emp_id),
    FOREIGN KEY (persona_id) REFERENCES persona(persona_id)
);

CREATE TABLE tareas (
    tarea_id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    supervisor_id INT,
    descripcion VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    prioridad ENUM('alta', 'media', 'baja') NOT NULL,
    estado ENUM('en', 'pe', 'de', 'co', 'su', 'ca') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id),
    FOREIGN KEY (supervisor_id) REFERENCES empleados(empleado_id)
);

CREATE TABLE bancos (
    banco_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    codigo VARCHAR(10) NOT NULL
);

CREATE TABLE conyuge (
    conyuge_id INT AUTO_INCREMENT PRIMARY KEY,
    persona_id INT NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES persona(persona_id)
);

CREATE TABLE datos_bancarios (
    datos_bancarios_id INT AUTO_INCREMENT PRIMARY KEY,
    banco_codigo_id INT NOT NULL,
    n_cuenta VARCHAR(50) NOT NULL,
    cuenta_default BOOLEAN NOT NULL,
    FOREIGN KEY (banco_codigo_id) REFERENCES bancos(banco_id)
);

CREATE TABLE clientes (
	cliente_id int auto_increment primary key,
    conyuge_id int null
);

alter table clientes
add column estado enum('a', 'n', 'g', 'd', 'm') not null default 'a';

alter table clientes
add column persona_id int not null;

alter table datos_bancarios
add column cliente_id int not null;

alter table datos_bancarios
add constraint fk_datos_bancarios
foreign key (cliente_id)
references clientes(cliente_id);

alter table clientes
add constraint fk_clientes_persona
foreign key (persona_id)
references persona(persona_id);

CREATE TABLE referencias (
    referencia_id INT AUTO_INCREMENT PRIMARY KEY,
    persona_id INT NOT NULL,
    cliente_id INT NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES persona(persona_id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE datos_laborales (
    dlab_id INT AUTO_INCREMENT PRIMARY KEY,
    dlabNombreEmpresa VARCHAR(40),
    dlabDepartamento VARCHAR(40),
    dlabPosicion VARCHAR(40),
    dlabHorarioEntrada VARCHAR(40),
    dlabHorarioSalida VARCHAR(40),
    dlabNombreSupervisor VARCHAR(40),
    dlabIdProvincia SMALLINT UNSIGNED,
    dlabIdMunicipio SMALLINT,
    dlabCalle VARCHAR(60),
    cliente_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE solicitudes_prestamo (
    solicitud_id INT NOT NULL AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    tipo_prestamo_id INT NOT NULL,
    empresa_id INT NOT NULL,
    monto_solicitado DECIMAL(10, 2) NOT NULL,
    monto_aprobado DECIMAL(10, 2),
    estado_solicitud ENUM('PE', 'EN', 'CA', 'DE', 'RE', 'AP') NOT NULL,
    emp_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    documentacion_id INT,
    PRIMARY KEY (solicitud_id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (tipo_prestamo_id) REFERENCES tipos_prestamos(tipo_prestamo_id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(emp_id),
    FOREIGN KEY (emp_id) REFERENCES empleados(empleado_id)
);

CREATE TABLE documentacion_solicitud (
    documentacion_id INT NOT NULL AUTO_INCREMENT,
    solicitud_id INT NOT NULL,
    enlace_imagen VARCHAR(255) NOT NULL,
    PRIMARY KEY (documentacion_id),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_prestamo(solicitud_id)
);

CREATE TABLE mensajes_estado_solicitud (
    mensaje_id INT NOT NULL AUTO_INCREMENT,
    solicitud_id INT NOT NULL,
    estado_anterior ENUM('PE', 'EN', 'CA', 'DE', 'RE', 'AP') NOT NULL,
    estado_nuevo ENUM('PE', 'EN', 'CA', 'DE', 'RE', 'AP') NOT NULL,
    mensaje TEXT NOT NULL,
    documentacion_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    empleado_id INT NOT NULL,
    PRIMARY KEY (mensaje_id),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_prestamo(solicitud_id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

