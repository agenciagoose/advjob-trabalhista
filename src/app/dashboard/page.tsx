"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, FileText, BarChart3, Database, LogOut, User, Plus, History, Settings, Send, Download, Upload, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, message: string, sender: 'user' | 'ai', timestamp: Date}>>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
      if (!user) {
        router.push('/login')
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Handlers funcionais para os botões
  const handleChatIA = () => {
    setActiveTab('chat')
  }

  const handleGerarContrato = () => {
    setActiveTab('contratos')
  }

  const handleGerarRelatorio = () => {
    setActiveTab('relatorios')
  }

  const handleGerenciarBase = () => {
    setActiveTab('base-conhecimento')
  }

  const handleNovaConsulta = () => {
    setActiveTab('chat')
    setChatMessages([])
    setCurrentMessage('')
  }

  const handleHistorico = () => {
    setActiveTab('historico')
  }

  const handleConfiguracoes = () => {
    setActiveTab('configuracoes')
  }

  // Função para enviar mensagem no chat
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      sender: 'user' as const,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsGenerating(true)

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        message: `Baseado na sua consulta sobre "${currentMessage}", posso orientar que no Direito Trabalhista brasileiro, é importante considerar os seguintes aspectos: 1) A CLT estabelece diretrizes claras sobre este tema; 2) A jurisprudência recente tem entendido que...; 3) Recomendo consultar os artigos específicos da legislação. Precisa de mais detalhes sobre algum ponto específico?`,
        sender: 'ai' as const,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiResponse])
      setIsGenerating(false)
    }, 2000)
  }

  // Função para gerar contrato
  const handleGenerateContract = (tipo: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      alert(`✅ Contrato de ${tipo} gerado com sucesso! O documento foi criado com todas as cláusulas necessárias e está pronto para download.`)
      setIsGenerating(false)
    }, 3000)
  }

  // Função para gerar relatório
  const handleGenerateReport = (tipo: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      alert(`📊 Relatório de ${tipo} gerado com sucesso! O documento contém análise detalhada e está formatado profissionalmente.`)
      setIsGenerating(false)
    }, 2500)
  }

  // Função para upload de documento
  const handleUploadDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`📄 Documento "${file.name}" foi adicionado à base de conhecimento com sucesso! A IA agora pode usar essas informações nas consultas.`)
      }
    }
    input.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AdvJob
                </h1>
                <p className="text-sm text-slate-600">Assistente Jurídico IA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button 
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('chat')}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat IA</span>
            </Button>
            <Button 
              variant={activeTab === 'contratos' ? 'default' : 'outline'}
              onClick={() => setActiveTab('contratos')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Contratos</span>
            </Button>
            <Button 
              variant={activeTab === 'relatorios' ? 'default' : 'outline'}
              onClick={() => setActiveTab('relatorios')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatórios</span>
            </Button>
            <Button 
              variant={activeTab === 'base-conhecimento' ? 'default' : 'outline'}
              onClick={() => setActiveTab('base-conhecimento')}
              className="flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Base de Conhecimento</span>
            </Button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Bem-vindo ao seu Dashboard! 👋
                </h1>
                <p className="text-xl text-slate-600">
                  Acesse todas as funcionalidades do AdvJob em um só lugar
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleChatIA}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Chat IA Especializada</CardTitle>
                    <CardDescription>
                      Converse com nossa IA treinada exclusivamente em Direito Trabalhista. 
                      Tire dúvidas e obtenha orientações jurídicas precisas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleChatIA}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Iniciar Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleGerarContrato}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Gerador de Contratos</CardTitle>
                    <CardDescription>
                      Crie contratos trabalhistas personalizados em minutos. 
                      Templates profissionais com cláusulas atualizadas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleGerarContrato}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Criar Contrato
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleGerarRelatorio}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Relatórios Inteligentes</CardTitle>
                    <CardDescription>
                      Gere relatórios profissionais automaticamente. 
                      Análises de casos e pareceres técnicos formatados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleGerarRelatorio}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleGerenciarBase}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Base de Conhecimento</CardTitle>
                    <CardDescription>
                      Alimente a IA com seus próprios documentos e precedentes. 
                      Crie uma base personalizada para seu escritório.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleGerenciarBase}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    >
                      Gerenciar Base
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Estatísticas de Uso</CardTitle>
                    <CardDescription>
                      Acompanhe seu progresso e produtividade com o AdvJob
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-slate-600">Contratos Criados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-indigo-600">45</div>
                        <div className="text-sm text-slate-600">Consultas IA</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-slate-600">Relatórios Gerados</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Ações Rápidas</h2>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleNovaConsulta}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Consulta IA</span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleHistorico}
                    className="border-2 border-slate-300 hover:border-blue-500 flex items-center space-x-2"
                  >
                    <History className="w-4 h-4" />
                    <span>Histórico de Contratos</span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleConfiguracoes}
                    className="border-2 border-slate-300 hover:border-indigo-500 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Chat IA Tab */}
          {activeTab === 'chat' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Chat IA Especializada</h2>
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Assistente Jurídico IA</CardTitle>
                  <CardDescription>Tire suas dúvidas sobre Direito Trabalhista</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-slate-500 py-12">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Inicie uma conversa com nossa IA especializada em Direito Trabalhista</p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            <p>{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 text-slate-900 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>IA está pensando...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua pergunta sobre Direito Trabalhista..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isGenerating}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contratos Tab */}
          {activeTab === 'contratos' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Gerador de Contratos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Contrato de Trabalho CLT</CardTitle>
                    <CardDescription>Contrato padrão com carteira assinada</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Trabalho CLT')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Contrato Temporário</CardTitle>
                    <CardDescription>Para trabalhos com prazo determinado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Temporário')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Contrato de Estágio</CardTitle>
                    <CardDescription>Para estudantes e recém-formados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Estágio')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Contrato de Experiência</CardTitle>
                    <CardDescription>Período probatório inicial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Experiência')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Acordo de Rescisão</CardTitle>
                    <CardDescription>Documentos para término de contrato</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Rescisão')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Contrato Personalizado</CardTitle>
                    <CardDescription>Crie um contrato sob medida</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateContract('Personalizado')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Criar Personalizado'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Relatórios Tab */}
          {activeTab === 'relatorios' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Relatórios Inteligentes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Parecer Técnico</CardTitle>
                    <CardDescription>Análise jurídica detalhada de casos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateReport('Parecer Técnico')}
                      disabled={isGenerating}
                      className="w-full mb-2"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Parecer'}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Exemplos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Relatório de Rescisão</CardTitle>
                    <CardDescription>Cálculos e documentação completa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateReport('Rescisão')}
                      disabled={isGenerating}
                      className="w-full mb-2"
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Análise de Folha de Pagamento</CardTitle>
                    <CardDescription>Auditoria e verificação de cálculos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateReport('Folha de Pagamento')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Analisar Folha'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Relatório de Compliance</CardTitle>
                    <CardDescription>Verificação de conformidade legal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleGenerateReport('Compliance')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Gerando...' : 'Verificar Compliance'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Base de Conhecimento Tab */}
          {activeTab === 'base-conhecimento' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Base de Conhecimento</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Documentos</CardTitle>
                    <CardDescription>Faça upload de documentos para treinar a IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleUploadDocument}
                      className="w-full mb-4"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </Button>
                    <p className="text-sm text-slate-600">
                      Formatos aceitos: PDF, DOC, DOCX, TXT
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentos na Base</CardTitle>
                    <CardDescription>Gerencie seus documentos carregados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm">CLT_Atualizada_2024.pdf</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm">Precedentes_TST.docx</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm">Modelos_Contratos.pdf</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas da Base</CardTitle>
                  <CardDescription>Informações sobre sua base de conhecimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">23</div>
                      <div className="text-sm text-slate-600">Documentos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">156</div>
                      <div className="text-sm text-slate-600">Páginas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">2.3k</div>
                      <div className="text-sm text-slate-600">Parágrafos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-slate-600">Processado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}