export interface Noticia {
    noticia_id?: number;
    empresa_id: number;
    titulo: string;
    descripcion: string;
    persona_id: number;
    fecha_publicacion: Date;
    fecha_vencimiento: Date;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}