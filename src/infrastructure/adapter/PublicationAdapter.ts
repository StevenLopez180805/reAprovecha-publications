import { Repository, IsNull, ILike } from 'typeorm';
import { Publication as PublicationDomain } from '../../domain/Publication';
import { PublicationPort } from "../../domain/PublicationPort";
import { AppDataSource } from '../config/data-base';
import { Publication as PublicationEntity } from '../entities/Publication';
import { PublicationStatus } from '../../domain/PublicationStatus.enum';

export class PublicationAdapter implements PublicationPort{

  private publicationRepository: Repository<PublicationEntity>;

  constructor(){
    this.publicationRepository = AppDataSource.getRepository(PublicationEntity);
  }

  private toDomain(publication: PublicationEntity): PublicationDomain {
    return {
      id: publication.id,
      titulo: publication.titulo,
      descripcion: publication.descripcion,
      precio: publication.precio,
      estado: publication.estado,
      user_id: publication.user_id,
      user_reserve_id: publication.user_reserve_id ?? null
    }
  }

  private toEntity(publication: Omit<PublicationDomain, "id">):PublicationEntity{
    const publicationEntity = new PublicationEntity();
    publicationEntity.titulo = publication.titulo;
    publicationEntity.descripcion = publication.descripcion;
    publicationEntity.precio = publication.precio;
    publicationEntity.estado = publication.estado;
    publicationEntity.user_id = publication.user_id;
    publicationEntity.user_reserve_id = publication.user_reserve_id ?? null
    return publicationEntity;
  }

  async createPublication(publication: Omit<PublicationDomain, "id">): Promise<number> {
    try {
      const newPublication = this.toEntity(publication);
      const savedPublication = await this.publicationRepository.save(newPublication);
      return savedPublication.id;
    } catch (error) {
      throw new Error("Error al crear la publicación");
    }
  }

  async updatePublication(id: number, publication: Partial<PublicationDomain>): Promise<boolean> {
    try {
      const existingPublication = await this.publicationRepository.findOne({where: {id: id}});
      if (!existingPublication) return false;

      Object.assign(existingPublication, {
        titulo: publication.titulo ?? existingPublication.titulo,
        descripcion: publication.descripcion ?? existingPublication.descripcion,
        precio: publication.precio ?? existingPublication.precio,
        estado: publication.estado ?? existingPublication.estado,
        user_id: publication.user_id ?? existingPublication.user_id,
        user_reserve_id: publication.user_reserve_id ?? existingPublication.user_reserve_id
      });

      await this.publicationRepository.save(existingPublication);
      return true;
    } catch (error) {
      throw new Error("Error al actualizar la publicación");
    }
  }

  async deletePublication(id: number): Promise<boolean> {
    try {
      const existingPublication = await this.publicationRepository.findOne({where: {id: id}});
      if (!existingPublication || existingPublication.estado == PublicationStatus.RESERVADA) return false;

      Object.assign(existingPublication, {
        deleted_at: new Date(),
      });

      await this.publicationRepository.save(existingPublication);
      return true;
    } catch (error) {
      throw new Error("Error al eliminar la publicación");
    }
  }

  async getPublicationById(id: number): Promise<PublicationDomain | null> {
    try {
      const publication = await this.publicationRepository.findOne({where: {id: id, deleted_at: IsNull()}})
      return publication? this.toDomain(publication) : null;
    } catch (error) {
      throw new Error("Ocurrió un error al obtener la publicación");
    }
  }
  
  async getPublicationsByUser(userId: number): Promise<PublicationDomain[]> {
    try {
      const publications = await this.publicationRepository.find({where: {user_id: userId, deleted_at: IsNull()}})
      return publications.map(this.toDomain);
    } catch (error) {
      throw new Error("Ocurrió un error al obtener las publicaciones");
    }
  }

  async getAllPublications(filters?: { titulo?: string; descripcion?: string }): Promise<PublicationDomain[]> {
    try {
      const whereConditions: any = { deleted_at: IsNull() };
      
      if (filters?.titulo) {
        whereConditions.titulo = ILike(`%${filters.titulo}%`);
      }
      
      if (filters?.descripcion) {
        whereConditions.descripcion = ILike(`%${filters.descripcion}%`);
      }
      
      const publications = await this.publicationRepository.find({ where: whereConditions });
      return publications.map(this.toDomain);
    } catch (error) {
      throw new Error("Ocurrió un error al obtener las publicaciones");
    }
  }

  async reservePublication(id:number, userReserveId: number): Promise<boolean> {
    try {
      const existingPublication = await this.publicationRepository.findOne({where: {id: id}});
      if (!existingPublication) return false;

      Object.assign(existingPublication, {
        user_reserve_id: userReserveId,
        estado: PublicationStatus.RESERVADA
      });

      await this.publicationRepository.save(existingPublication);
      return true;
    } catch (error) {
      throw new Error("Error al reservar la publicación");
    }
  }

  async unreservePublication(id:number): Promise<boolean> {
    try {
      const existingPublication = await this.publicationRepository.findOne({where: {id: id}});
      if (!existingPublication) return false;

      Object.assign(existingPublication, {
        user_reserve_id: null,
        estado: PublicationStatus.DISPONIBLE
      });

      await this.publicationRepository.save(existingPublication);
      return true;
    } catch (error) {
      throw new Error("Error al deshacer la reserva de la publicación");
    }
  }

}