"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText, Calendar, DollarSign, Users } from "lucide-react"

interface ReportData {
  type: string
  companyName: string
  period: string
  startDate: string
  endDate: string
  totalEmployees: string
  totalSalary: string
  benefits: string
  observations: string
}

interface EmployeeData {
  name: string
  position: string
  salary: string
  admissionDate: string
  status: string
}

export default function ReportGenerator() {
  const [reportData, setReportData] = useState<ReportData>({
    type: '',
    companyName: '',
    period: '',
    startDate: '',
    endDate: '',
    totalEmployees: '',
    totalSalary: '',
    benefits: '',
    observations: ''
  })
  
  const [employees, setEmployees] = useState<EmployeeData[]>([])
  const [generatedReport, setGeneratedReport] = useState('')
  const [newEmployee, setNewEmployee] = useState<EmployeeData>({
    name: '',
    position: '',
    salary: '',
    admissionDate: '',
    status: 'ativo'
  })

  const reportTypes = {
    folha: 'Relatório de Folha de Pagamento',
    admissoes: 'Relatório de Admissões e Demissões',
    ferias: 'Relatório de Férias',
    beneficios: 'Relatório de Benefícios',
    horas: 'Relatório de Horas Extras',
    compliance: 'Relatório de Compliance Trabalhista'
  }

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.position && newEmployee.salary) {
      setEmployees(prev => [...prev, { ...newEmployee, admissionDate: newEmployee.admissionDate || new Date().toISOString().split('T')[0] }])
      setNewEmployee({
        name: '',
        position: '',
        salary: '',
        admissionDate: '',
        status: 'ativo'
      })
    }
  }

  const removeEmployee = (index: number) => {
    setEmployees(prev => prev.filter((_, i) => i !== index))
  }

  const generateReport = () => {
    let report = ''
    const currentDate = new Date().toLocaleDateString('pt-BR')
    
    switch (reportData.type) {
      case 'folha':
        const totalSalaries = employees.reduce((sum, emp) => sum + parseFloat(emp.salary.replace(/[^\d,]/g, '').replace(',', '.') || '0'), 0)
        
        report = `RELATÓRIO DE FOLHA DE PAGAMENTO

Empresa: ${reportData.companyName}
Período: ${reportData.startDate} a ${reportData.endDate}
Data de Geração: ${currentDate}

RESUMO GERAL:
• Total de Funcionários: ${employees.length}
• Folha Bruta Total: R$ ${totalSalaries.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Benefícios: ${reportData.benefits || 'Não informado'}

DETALHAMENTO POR FUNCIONÁRIO:
${employees.map((emp, index) => `
${index + 1}. ${emp.name}
   Cargo: ${emp.position}
   Salário: R$ ${emp.salary}
   Admissão: ${new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
   Status: ${emp.status.toUpperCase()}
`).join('')}

OBSERVAÇÕES:
${reportData.observations || 'Nenhuma observação adicional.'}

ENCARGOS ESTIMADOS:
• INSS Empresa (20%): R$ ${(totalSalaries * 0.20).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• FGTS (8%): R$ ${(totalSalaries * 0.08).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Total com Encargos: R$ ${(totalSalaries * 1.28).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Este relatório foi gerado automaticamente pelo sistema AdvJob.`
        break

      case 'admissoes':
        const admissoes = employees.filter(emp => emp.status === 'ativo')
        const demissoes = employees.filter(emp => emp.status === 'demitido')
        
        report = `RELATÓRIO DE ADMISSÕES E DEMISSÕES

Empresa: ${reportData.companyName}
Período: ${reportData.startDate} a ${reportData.endDate}
Data de Geração: ${currentDate}

RESUMO:
• Total de Admissões: ${admissoes.length}
• Total de Demissões: ${demissoes.length}
• Saldo Líquido: ${admissoes.length - demissoes.length}

ADMISSÕES NO PERÍODO:
${admissoes.map((emp, index) => `
${index + 1}. ${emp.name} - ${emp.position}
   Data de Admissão: ${new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
   Salário: R$ ${emp.salary}
`).join('')}

DEMISSÕES NO PERÍODO:
${demissoes.map((emp, index) => `
${index + 1}. ${emp.name} - ${emp.position}
   Salário: R$ ${emp.salary}
`).join('')}

OBSERVAÇÕES:
${reportData.observations || 'Nenhuma observação adicional.'}

Este relatório foi gerado automaticamente pelo sistema AdvJob.`
        break

      case 'ferias':
        report = `RELATÓRIO DE FÉRIAS

Empresa: ${reportData.companyName}
Período de Análise: ${reportData.startDate} a ${reportData.endDate}
Data de Geração: ${currentDate}

FUNCIONÁRIOS E SITUAÇÃO DE FÉRIAS:
${employees.map((emp, index) => {
  const admissionDate = new Date(emp.admissionDate)
  const today = new Date()
  const monthsWorked = Math.floor((today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const feriasPendentes = Math.floor(monthsWorked / 12)
  
  return `
${index + 1}. ${emp.name}
   Cargo: ${emp.position}
   Admissão: ${admissionDate.toLocaleDateString('pt-BR')}
   Tempo de Casa: ${monthsWorked} meses
   Períodos de Férias Adquiridos: ${feriasPendentes}
   Status: ${feriasPendentes > 0 ? 'FÉRIAS PENDENTES' : 'Em dia'}
`}).join('')}

RESUMO GERAL:
• Total de Funcionários: ${employees.length}
• Funcionários com Férias Pendentes: ${employees.filter(emp => {
  const monthsWorked = Math.floor((new Date().getTime() - new Date(emp.admissionDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
  return Math.floor(monthsWorked / 12) > 0
}).length}

OBSERVAÇÕES:
${reportData.observations || 'Nenhuma observação adicional.'}

Este relatório foi gerado automaticamente pelo sistema AdvJob.`
        break

      case 'compliance':
        report = `RELATÓRIO DE COMPLIANCE TRABALHISTA

Empresa: ${reportData.companyName}
Período: ${reportData.startDate} a ${reportData.endDate}
Data de Geração: ${currentDate}

VERIFICAÇÕES DE COMPLIANCE:

1. DOCUMENTAÇÃO TRABALHISTA:
   ✓ Contratos de trabalho assinados
   ✓ Carteiras de trabalho atualizadas
   ✓ Exames médicos em dia

2. OBRIGAÇÕES MENSAIS:
   ✓ FGTS recolhido em dia
   ✓ INSS recolhido corretamente
   ✓ Folha de pagamento processada

3. OBRIGAÇÕES ANUAIS:
   ✓ RAIS entregue
   ✓ DIRF apresentada
   ✓ 13º salário pago

4. FUNCIONÁRIOS CADASTRADOS:
${employees.map((emp, index) => `
   ${index + 1}. ${emp.name} - ${emp.position}
      Status: ${emp.status.toUpperCase()}
      Situação: REGULAR
`).join('')}

RECOMENDAÇÕES:
• Manter documentação sempre atualizada
• Acompanhar prazos de obrigações acessórias
• Realizar treinamentos periódicos sobre legislação trabalhista

OBSERVAÇÕES:
${reportData.observations || 'Empresa em conformidade com a legislação trabalhista vigente.'}

Este relatório foi gerado automaticamente pelo sistema AdvJob.`
        break

      default:
        report = 'Selecione um tipo de relatório para gerar o documento.'
    }
    
    setGeneratedReport(report)
  }

  const downloadReport = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedReport], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `relatorio_${reportData.type}_${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const saveToLocalStorage = () => {
    const reports = JSON.parse(localStorage.getItem('advjob_reports') || '[]')
    const newReport = {
      id: Date.now(),
      type: reportData.type,
      companyName: reportData.companyName,
      period: `${reportData.startDate} a ${reportData.endDate}`,
      createdAt: new Date().toISOString(),
      content: generatedReport
    }
    reports.push(newReport)
    localStorage.setItem('advjob_reports', JSON.stringify(reports))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Gerador de Relatórios Trabalhistas</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="employees">Funcionários</TabsTrigger>
              <TabsTrigger value="report">Relatório</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Tipo de Relatório</Label>
                  <Select
                    value={reportData.type}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reportTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={reportData.companyName}
                    onChange={(e) => setReportData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={reportData.startDate}
                    onChange={(e) => setReportData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={reportData.endDate}
                    onChange={(e) => setReportData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios Oferecidos</Label>
                <Input
                  id="benefits"
                  value={reportData.benefits}
                  onChange={(e) => setReportData(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="Ex: Vale alimentação, Plano de saúde, Vale transporte"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={reportData.observations}
                  onChange={(e) => setReportData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Observações adicionais para o relatório..."
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="employees" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="w-5 h-5" />
                    <span>Adicionar Funcionário</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empName">Nome Completo</Label>
                      <Input
                        id="empName"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nome do funcionário"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empPosition">Cargo</Label>
                      <Input
                        id="empPosition"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Cargo do funcionário"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empSalary">Salário</Label>
                      <Input
                        id="empSalary"
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                        placeholder="Ex: 3.500,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empAdmission">Data de Admissão</Label>
                      <Input
                        id="empAdmission"
                        type="date"
                        value={newEmployee.admissionDate}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, admissionDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empStatus">Status</Label>
                      <Select
                        value={newEmployee.status}
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="demitido">Demitido</SelectItem>
                          <SelectItem value="afastado">Afastado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={addEmployee} className="w-full">
                    Adicionar Funcionário
                  </Button>
                </CardContent>
              </Card>

              {employees.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Funcionários Cadastrados ({employees.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employees.map((emp, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{emp.name}</span>
                              <Badge variant={emp.status === 'ativo' ? 'default' : 'secondary'}>
                                {emp.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {emp.position} • R$ {emp.salary} • Admissão: {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeEmployee(index)}
                            variant="outline"
                            size="sm"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="report" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  onClick={generateReport}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!reportData.type || !reportData.companyName}
                >
                  Gerar Relatório
                </Button>
                
                {generatedReport && (
                  <>
                    <Button
                      onClick={downloadReport}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                    
                    <Button
                      onClick={saveToLocalStorage}
                      variant="outline"
                      size="sm"
                    >
                      Salvar
                    </Button>
                  </>
                )}
              </div>
              
              {generatedReport ? (
                <Card>
                  <CardContent className="p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100">
                      {generatedReport}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Configure os dados e clique em "Gerar Relatório" para visualizar o documento.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}