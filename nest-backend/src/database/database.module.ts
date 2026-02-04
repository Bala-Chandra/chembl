import { Module } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'chembl_36',
};

@Module({
  providers: [
    {
      provide: Pool,
      useFactory: (): Pool => {
        return new Pool(poolConfig);
      },
    },
  ],
  exports: [Pool],
})
export class DatabaseModule {}
