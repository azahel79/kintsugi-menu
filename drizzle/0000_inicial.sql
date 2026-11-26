CREATE TABLE "admin_usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nombre" text DEFAULT 'Dueño' NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" text PRIMARY KEY NOT NULL,
	"seccion_id" text NOT NULL,
	"nombre" text NOT NULL,
	"mostrar_titulo" boolean DEFAULT true NOT NULL,
	"estilo" text DEFAULT 'lista' NOT NULL,
	"sub_mayus" boolean DEFAULT false NOT NULL,
	"vertical" text DEFAULT '' NOT NULL,
	"lado" text DEFAULT 'der' NOT NULL,
	"kanji" text DEFAULT '品' NOT NULL,
	"nota" text DEFAULT '' NOT NULL,
	"armable" boolean DEFAULT false NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imagenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mime" text NOT NULL,
	"bytes" integer NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "negocio" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"nombre" text NOT NULL,
	"lema" text DEFAULT '' NOT NULL,
	"bienvenida_titulo" text DEFAULT '' NOT NULL,
	"bienvenida_texto" text DEFAULT '' NOT NULL,
	"horario" text DEFAULT '' NOT NULL,
	"direccion" text DEFAULT '' NOT NULL,
	"zona" text DEFAULT '' NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"facebook" text DEFAULT '' NOT NULL,
	"instagram" text DEFAULT '' NOT NULL,
	"portada" text,
	"mascota" text,
	"aviso_mesero" text DEFAULT 'Pídelo a tu mesero' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" text PRIMARY KEY NOT NULL,
	"categoria_id" text NOT NULL,
	"nombre" text NOT NULL,
	"jp" text DEFAULT '' NOT NULL,
	"precio" numeric(10, 2) NOT NULL,
	"sub" text DEFAULT '' NOT NULL,
	"descripcion" text DEFAULT '' NOT NULL,
	"img" text,
	"disponible" boolean DEFAULT true NOT NULL,
	"etiquetas" text[] DEFAULT '{}' NOT NULL,
	"opciones_titulo" text,
	"opciones" text[] DEFAULT '{}' NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promocion_productos" (
	"promocion_id" text NOT NULL,
	"producto_id" text NOT NULL,
	CONSTRAINT "promocion_productos_promocion_id_producto_id_pk" PRIMARY KEY("promocion_id","producto_id")
);
--> statement-breakpoint
CREATE TABLE "promociones" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"subtitulo" text DEFAULT '' NOT NULL,
	"texto" text DEFAULT '' NOT NULL,
	"etiqueta" text DEFAULT '' NOT NULL,
	"img" text,
	"activa" boolean DEFAULT true NOT NULL,
	"portada" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "secciones" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"jp" text DEFAULT '' NOT NULL,
	"fondo" text,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sushi_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"incluidos" integer DEFAULT 3 NOT NULL,
	"extra_verdura" numeric(10, 2) DEFAULT 15 NOT NULL,
	"extra_proteina" numeric(10, 2) DEFAULT 25 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sushi_ingredientes" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"icono" text DEFAULT 'restaurant' NOT NULL,
	"tipo" text DEFAULT 'verdura' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_seccion_id_secciones_id_fk" FOREIGN KEY ("seccion_id") REFERENCES "public"."secciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promocion_productos" ADD CONSTRAINT "promocion_productos_promocion_id_promociones_id_fk" FOREIGN KEY ("promocion_id") REFERENCES "public"."promociones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promocion_productos" ADD CONSTRAINT "promocion_productos_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;