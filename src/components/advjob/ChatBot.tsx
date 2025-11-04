"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true)
    setMessages([
      {
        id: '1',
        content: 'Olá! Sou a AdvJob, sua assistente especializada em Direito Trabalhista. Como posso ajudá-lo hoje?',
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }, [])

  // Simulated AI responses for labor law questions
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('férias')) {
      return 'Sobre férias: Todo empregado tem direito a 30 dias de férias após 12 meses de trabalho. As férias podem ser divididas em até 3 períodos, sendo que um deles não pode ser inferior a 14 dias. O empregado deve receber o valor das férias acrescido de 1/3 constitucional.'
    }
    
    if (message.includes('13º') || message.includes('décimo terceiro')) {
      return 'O 13º salário é um direito garantido pela Constituição. Deve ser pago em duas parcelas: a primeira até 30 de novembro (50% do salário) e a segunda até 20 de dezembro (valor restante com descontos). Empregados com carteira assinada, aposentados e pensionistas têm direito.'
    }
    
    if (message.includes('demissão') || message.includes('rescisão')) {
      return 'Na rescisão do contrato de trabalho, o empregado tem direito a: saldo de salário, férias vencidas + 1/3, férias proporcionais + 1/3, 13º proporcional. Se for demissão sem justa causa, também recebe: aviso prévio, multa de 40% do FGTS e seguro-desemprego (se atender aos requisitos).'
    }
    
    if (message.includes('jornada') || message.includes('horas')) {
      return 'A jornada normal de trabalho é de 8 horas diárias e 44 horas semanais. Horas extras devem ser pagas com adicional mínimo de 50%. O limite de horas extras é de 2 horas por dia. Trabalho noturno (22h às 5h) tem adicional de 20%.'
    }
    
    if (message.includes('fgts')) {
      return 'O FGTS corresponde a 8% do salário bruto depositado mensalmente pelo empregador. Pode ser sacado em casos como: demissão sem justa causa, aposentadoria, compra da casa própria, doenças graves, entre outros. O trabalhador tem direito ao extrato e pode consultar o saldo.'
    }
    
    return 'Entendo sua dúvida sobre Direito Trabalhista. Para uma resposta mais específica, recomendo que detalhe melhor sua situação. Posso ajudar com questões sobre férias, 13º salário, rescisão, jornada de trabalho, FGTS, direitos do trabalhador, entre outros temas trabalhistas.'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Don't render messages until client-side
  if (!isClient) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>Chat com AdvJob</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            </div>
          </ScrollArea>
          
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Carregando chat..."
                className="flex-1"
                disabled
              />
              <Button disabled className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>Chat com AdvJob</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={
                    message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      AdvJob está pensando...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua dúvida sobre Direito Trabalhista..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Pressione Enter para enviar • Esta é uma simulação de IA
          </p>
        </div>
      </CardContent>
    </Card>
  )
}