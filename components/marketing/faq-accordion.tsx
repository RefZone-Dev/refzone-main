'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-base font-medium text-white">
          {item.question}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-white/45 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        style={{ height, overflow: 'hidden', transition: 'height 0.25s ease-out' }}
      >
        <div ref={contentRef} className="pb-5 text-[0.938rem] leading-relaxed text-white/45">
          {item.answer}
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <div className="w-full" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => handleToggle(i)}
        />
      ))}
    </div>
  )
}
