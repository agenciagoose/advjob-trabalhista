"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, File, Trash2, Search, Plus, BookOpen, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: 'text' | 'pdf' | 'docx'
  createdAt: string
  tags: string[]
}

export default function KnowledgeBase() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [newText, setNewText] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newTags, setNewTags] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<'all' | 'text' | 'pdf' | 'docx'>('all')
  const [isClient, setIsClient] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('advjob-knowledge-base')
    if (saved) {
      setKnowledgeItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('advjob-knowledge-base', JSON.stringify(knowledgeItems))
    }
  }, [knowledgeItems, isClient])

  const addTextKnowledge = () => {
    if (!newText.trim() || !newTitle.trim()) return

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newText.trim(),
      type: 'text',
      createdAt: new Date().toISOString(),
      tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    setKnowledgeItems(prev => [newItem, ...prev])
    setNewText("")
    setNewTitle("")
    setNewTags("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx'
      
      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        title: file.name,
        content: content.substring(0, 10000), // Limita o conteúdo para evitar problemas de memória
        type: fileType,
        createdAt: new Date().toISOString(),
        tags: [fileType, 'documento']
      }

      setKnowledgeItems(prev => [newItem, ...prev])
    }
    
    reader.readAsText(file)
    event.target.value = ''
  }

  const deleteItem = (id: string) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id))
  }

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || item.type === selectedType
    
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-4 h-4 text-red-500" />
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-500" />
      default:
        return <BookOpen className="w-4 h-4 text-green-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'docx':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Base de Conhecimento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-500">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900 dark:text-purple-100">
            <Database className="w-5 h-5" />
            <span>Base de Conhecimento da IA</span>
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Alimente a rede neural com informações jurídicas através de textos, PDFs ou documentos Word.
            Essas informações serão usadas como base para respostas mais precisas.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Adicionar Conhecimento</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Gerenciar Base ({knowledgeItems.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Adicionar Conhecimento */}
        <TabsContent value="add" className="space-y-6">
          {/* Upload de Arquivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload de Documentos</span>
              </CardTitle>
              <CardDescription>
                Faça upload de arquivos PDF ou DOCX para extrair conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Clique para selecionar arquivos PDF ou DOCX
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Selecionar Arquivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Entrada de Texto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Adicionar Texto</span>
              </CardTitle>
              <CardDescription>
                Digite ou cole informações jurídicas diretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Título do Conhecimento
                </label>
                <Input
                  placeholder="Ex: Artigo 7º da CLT - Direitos dos Trabalhadores"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Conteúdo
                </label>
                <Textarea
                  placeholder="Cole aqui o texto com informações jurídicas que a IA deve aprender..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={8}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Tags (separadas por vírgula)
                </label>
                <Input
                  placeholder="Ex: CLT, direitos trabalhistas, férias, rescisão"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>

              <Button 
                onClick={addTextKnowledge}
                disabled={!newText.trim() || !newTitle.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar à Base de Conhecimento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gerenciar Base */}
        <TabsContent value="manage" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar na base de conhecimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('all')}
                  >
                    Todos ({knowledgeItems.length})
                  </Button>
                  <Button
                    variant={selectedType === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('text')}
                  >
                    Textos ({knowledgeItems.filter(i => i.type === 'text').length})
                  </Button>
                  <Button
                    variant={selectedType === 'pdf' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('pdf')}
                  >
                    PDFs ({knowledgeItems.filter(i => i.type === 'pdf').length})
                  </Button>
                  <Button
                    variant={selectedType === 'docx' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('docx')}
                  >
                    DOCX ({knowledgeItems.filter(i => i.type === 'docx').length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Conhecimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Conhecimentos Armazenados</CardTitle>
              <CardDescription>
                {filteredItems.length} de {knowledgeItems.length} itens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">
                      {knowledgeItems.length === 0 
                        ? "Nenhum conhecimento adicionado ainda" 
                        : "Nenhum item encontrado com os filtros aplicados"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              {getTypeIcon(item.type)}
                              <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                {item.title}
                              </h3>
                              <Badge className={getTypeColor(item.type)}>
                                {item.type.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                              {item.content.substring(0, 150)}...
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <p className="text-xs text-slate-500">
                              Adicionado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {index < filteredItems.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}