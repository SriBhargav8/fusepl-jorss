'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { LeadCaptureModal } from '@/components/modals/lead-capture-modal'

interface ModalContextType {
  isLeadModalOpen: boolean
  openLeadModal: () => void
  closeLeadModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const openLeadModal = () => setIsLeadModalOpen(true)
  const closeLeadModal = () => setIsLeadModalOpen(false)

  return (
    <ModalContext.Provider value={{ isLeadModalOpen, openLeadModal, closeLeadModal }}>
      {children}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={closeLeadModal} />
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within ModalProvider')
  return context
}
