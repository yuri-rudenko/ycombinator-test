import {Global, Module} from '@nestjs/common'
import {SquareClient, SquareEnvironment} from 'square'
import {ConfigService} from '@nestjs/config'

@Global()
@Module({
  providers: [
    {
      provide: 'SQUARE_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new SquareClient({
          token: config.get<string>('SQUARE_ACCESS_TOKEN'),
          environment: SquareEnvironment.Sandbox,
        });
      },
    },
  ],
  exports: ['SQUARE_CLIENT'],
})
export class SquareModule {}