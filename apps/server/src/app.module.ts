import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CommonModule} from './common/common.module'
import {SquareModule} from './square/square.module'
import {CatalogModule} from './catalog/catalog.module'
import {ConfigModule} from '@nestjs/config'
import {CacheModule} from '@nestjs/cache-manager'
import {LocationsModule} from './locations/locations.module'

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100
    }), CommonModule, SquareModule, CatalogModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
