import { Test, TestingModule } from '@nestjs/testing';

import { InMemoryCacheService } from './in-memory-cache.service';

describe('InMemoryCacheService', () => {
    let service: InMemoryCacheService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InMemoryCacheService],
        }).compile();

        service = module.get<InMemoryCacheService>(InMemoryCacheService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
