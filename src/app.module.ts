import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { AuthModule } from './Auth/auth.module';
import { UsersModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { ListModule } from './list/list.module';
import { ReactionsModule } from './reactions/reactions.module';
import { Content } from './content/entities/content.entity';
import { List } from './list/entity/list.entity';
import { User } from './Auth/entities/user.entity';

// Importa los módulos de GraphQL y ApolloDriver
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.URL,
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([User, List, Content]),
    
    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Archivo generado del esquema
      playground: true, // Habilita GraphQL Playground para pruebas
    }),

    // Otros módulos de la aplicación
    AuthModule,
    UsersModule,
    ContentModule,
    CommentsModule,
    ListModule,
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
