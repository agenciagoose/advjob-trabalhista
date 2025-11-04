"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Plus, Search, Bookmark, Trash2, Edit, Loader2 } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isFavorite: boolean
  createdAt: string
}

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'Qual é o prazo para pagamento do salário?',
    answer: 'O salário deve ser pago até o 5º dia útil do mês subsequente ao trabalhado. Para empregados mensalistas, o pagamento pode ser feito até o 5º dia útil do mês seguinte.',
    category: 'Salário',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    question: 'Como calcular as férias do empregado?',
    answer: 'As férias são calculadas sobre o salário integral do empregado, acrescidas de 1/3 constitucional. O empregado tem direito a 30 dias de férias após 12 meses de trabalho.',
    category: 'Férias',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    question: 'Quando é devido o pagamento do 13º salário?',
    answer: 'O 13º salário deve ser pago em duas parcelas: primeira parcela até 30 de novembro (50% do salário) e segunda parcela até 20 de dezembro (valor restante com descontos).',
    category: '13º Salário',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    question: 'Qual o limite de horas extras por dia?',
    answer: 'O limite de horas extras é de 2 horas por dia, devendo ser pagas com adicional mínimo de 50% sobre o valor da hora normal. Aos domingos e feriados, o adicional é de 100%.',
    category: 'Jornada',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '5',
    question: 'Como funciona o aviso prévio?',
    answer: 'O aviso prévio pode ser trabalhado ou indenizado. Quando trabalhado, o empregado tem direito a redução de 2 horas diárias ou 7 dias corridos. O prazo varia de 30 a 90 dias conforme o tempo de serviço.',
    category: 'Rescisão',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: ''
  })
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true)
    const savedFAQs = localStorage.getItem('advjob_faqs')
    if (savedFAQs) {
      setFaqs(JSON.parse(savedFAQs))
    } else {
      setFaqs(defaultFAQs)
      localStorage.setItem('advjob_faqs', JSON.stringify(defaultFAQs))
    }
  }, [])

  // Save FAQs to localStorage whenever faqs state changes
  useEffect(() => {
    if (faqs.length > 0 && isClient) {
      localStorage.setItem('advjob_faqs', JSON.stringify(faqs))
    }
  }, [faqs, isClient])

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const favoriteFAQs = faqs.filter(faq => faq.isFavorite)

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer && newFAQ.category) {
      const faq: FAQItem = {
        id: Date.now().toString(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category,
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
      setFaqs(prev => [...prev, faq])
      setNewFAQ({ question: '', answer: '', category: '' })
    }
  }

  const updateFAQ = () => {
    if (editingFAQ && newFAQ.question && newFAQ.answer && newFAQ.category) {
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...faq, question: newFAQ.question, answer: newFAQ.answer, category: newFAQ.category }
          : faq
      ))
      setEditingFAQ(null)
      setNewFAQ({ question: '', answer: '', category: '' })
    }
  }

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isFavorite: !faq.isFavorite } : faq
    ))
  }

  const startEditing = (faq: FAQItem) => {
    setEditingFAQ(faq)
    setNewFAQ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    })
  }

  const cancelEditing = () => {
    setEditingFAQ(null)
    setNewFAQ({ question: '', answer: '', category: '' })
  }

  const getTodayFAQsCount = () => {
    if (!isClient) return 0
    return faqs.filter(faq => {
      const faqDate = new Date(faq.createdAt).toDateString()
      const today = new Date().toDateString()
      return faqDate === today
    }).length
  }

  // Loading state for SSR
  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Perguntas Frequentes - Direito Trabalhista</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Perguntas Frequentes - Direito Trabalhista</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Navegar</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="manage">Gerenciar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar perguntas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Todas
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {filteredFAQs.length} pergunta(s) encontrada(s)
                  </h3>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>{faq.question}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(faq.id)
                              }}
                              className={`cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                faq.isFavorite ? 'text-yellow-500' : 'text-slate-400'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500">
                              Criado em: {new Date(faq.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            <div className="flex space-x-2">
                              <div
                                onClick={() => startEditing(faq)}
                                className="cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Edit className="w-4 h-4" />
                              </div>
                              <div
                                onClick={() => deleteFAQ(faq.id)}
                                className="cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Nenhuma pergunta encontrada com os filtros aplicados.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Perguntas Favoritas ({favoriteFAQs.length})
                </h3>

                {favoriteFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {favoriteFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span>{faq.question}</span>
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Você ainda não tem perguntas favoritas. Clique no ícone de bookmark para adicionar.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Plus className="w-5 h-5" />
                    <span>{editingFAQ ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Pergunta</Label>
                    <Input
                      id="question"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Digite a pergunta..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="answer">Resposta</Label>
                    <Textarea
                      id="answer"
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Digite a resposta detalhada..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={newFAQ.category}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: Salário, Férias, FGTS..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={editingFAQ ? updateFAQ : addFAQ}
                      className="flex-1"
                      disabled={!newFAQ.question || !newFAQ.answer || !newFAQ.category}
                    >
                      {editingFAQ ? 'Atualizar' : 'Adicionar'} Pergunta
                    </Button>
                    {editingFAQ && (
                      <Button 
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{faqs.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total de Perguntas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Categorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{favoriteFAQs.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Favoritas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {getTodayFAQsCount()}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Hoje</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}