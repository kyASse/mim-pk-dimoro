import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import LayoutContent from '../LayoutContent'

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}))

vi.mock('../Navbar', () => ({
  default: () => <div data-testid="mock-navbar">Navbar</div>,
}))

vi.mock('../Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>,
}))

vi.mock('../PublicMobileFloatingBar', () => ({
  default: () => <div data-testid="mock-floating-bar">PublicMobileFloatingBar</div>,
}))

describe('LayoutContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathname.mockReturnValue('/')
  })

  it('renders Navbar, Footer, PublicMobileFloatingBar, and wraps children with pb-20 md:pb-0 on public routes', () => {
    mockUsePathname.mockReturnValue('/')
    render(
      <LayoutContent>
        <div data-testid="test-content">Main Page Content</div>
      </LayoutContent>
    )

    // Navbar and Footer are rendered
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument()
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument()

    // Floating bar is rendered
    expect(screen.getByTestId('mock-floating-bar')).toBeInTheDocument()

    // Main content is present and wrapped with responsive bottom padding
    const content = screen.getByTestId('test-content')
    expect(content).toBeInTheDocument()
    const contentWrapper = content.parentElement
    expect(contentWrapper).toHaveClass('pb-20', 'md:pb-0')
  })

  it('hides Navbar, Footer, PublicMobileFloatingBar and does not apply pb-20 on /admin routes', () => {
    mockUsePathname.mockReturnValue('/admin/dashboard')
    render(
      <LayoutContent>
        <div data-testid="test-admin-content">Admin Dashboard Content</div>
      </LayoutContent>
    )

    expect(screen.queryByTestId('mock-navbar')).toBeNull()
    expect(screen.queryByTestId('mock-footer')).toBeNull()
    expect(screen.queryByTestId('mock-floating-bar')).toBeNull()

    const content = screen.getByTestId('test-admin-content')
    expect(content).toBeInTheDocument()
    const contentWrapper = content.parentElement
    expect(contentWrapper).not.toHaveClass('pb-20')
  })

  it('hides Navbar, Footer, PublicMobileFloatingBar and does not apply pb-20 on /portal routes', () => {
    mockUsePathname.mockReturnValue('/portal')
    render(
      <LayoutContent>
        <div data-testid="test-portal-content">Portal Content</div>
      </LayoutContent>
    )

    expect(screen.queryByTestId('mock-navbar')).toBeNull()
    expect(screen.queryByTestId('mock-footer')).toBeNull()
    expect(screen.queryByTestId('mock-floating-bar')).toBeNull()

    const content = screen.getByTestId('test-portal-content')
    expect(content).toBeInTheDocument()
    const contentWrapper = content.parentElement
    expect(contentWrapper).not.toHaveClass('pb-20')
  })
})
