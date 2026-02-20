'use client'

import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'
import {Button} from '@heroui/react'
import {Sun, Moon} from 'lucide-react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const {theme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      isIconOnly
      variant="flat"
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}