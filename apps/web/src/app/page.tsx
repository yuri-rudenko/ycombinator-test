'use client'

import {CategoryTabs} from '@/src/features/categories-tabs'
import {Container} from '@/src/shared/ui/Container'

export default function Home() {
  return (<main className={'h-screen'}>
    <Container className={'mt-5'}>
      <CategoryTabs />
    </Container>
  </main>)
}
