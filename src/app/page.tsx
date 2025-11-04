"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileText, BarChart3, HelpCircle, Database } from "lucide-react"
import ChatBot from "@/components/advjob/ChatBot"
import ContractGenerator from "@/components/advjob/ContractGenerator"
import ReportGenerator from "@/components/advjob/ReportGenerator"
import FAQ from "@/components/advjob/FAQ"
import KnowledgeBase from "@/components/advjob/KnowledgeBase"

export default function AdvJob() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AdvJob</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Assistente Jurídico Trabalhista</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                  Bem-vindo ao AdvJob
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Sua assistente de inteligência artificial especializada em Direito Trabalhista. 
                  Tire dúvidas, crie contratos e gere relatórios profissionais.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger 
                value="chat" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contracts"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Contratos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="knowledge"
                className="flex items-center space-x-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-950 dark:data-[state=active]:text-purple-300"
              >
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Base IA</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="chat" className="mt-0">
              <ChatBot />
            </TabsContent>

            <TabsContent value="contracts" className="mt-0">
              <ContractGenerator />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportGenerator />
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0">
              <KnowledgeBase />
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <FAQ />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 md:mb-0">
              © 2024 AdvJob - Assistente Jurídico Trabalhista
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              Desenvolvido com IA para profissionais do Direito
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}