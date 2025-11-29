import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PublicationStatus } from "../../domain/PublicationStatus.enum";

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: "varchar", length: 250 })
  titulo!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "int" })
  precio!: number;

  @Column({
    type: "enum",
    enum: PublicationStatus,
    default: PublicationStatus.DISPONIBLE
  })
  estado!: PublicationStatus;

  @Column({ type: "bigint" })
  user_id!: number;

  @Column({ type: "bigint", nullable: true })
  user_reserve_id!: number | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;
}
