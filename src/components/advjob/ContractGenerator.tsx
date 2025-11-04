"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Copy, Check } from "lucide-react"

interface ContractData {
  type: string
  employerName: string
  employerCnpj: string
  employerAddress: string
  employeeName: string
  employeeCpf: string
  employeeAddress: string
  position: string
  salary: string
  workSchedule: string
  startDate: string
  additionalClauses: string
}

export default function ContractGenerator() {
  const [contractData, setContractData] = useState<ContractData>({
    type: '',
    employerName: '',
    employerCnpj: '',
    employerAddress: '',
    employeeName: '',
    employeeCpf: '',
    employeeAddress: '',
    position: '',
    salary: '',
    workSchedule: '',
    startDate: '',
    additionalClauses: ''
  })
  
  const [generatedContract, setGeneratedContract] = useState('')
  const [copied, setCopied] = useState(false)

  const contractTemplates = {
    clt: 'Contrato de Trabalho CLT',
    temporario: 'Contrato de Trabalho Temporário',
    estagio: 'Contrato de Estágio',
    terceirizado: 'Contrato de Terceirização',
    autonomo: 'Contrato de Prestação de Serviços'
  }

  const generateContract = () => {
    let template = ''
    
    switch (contractData.type) {
      case 'clt':
        template = `CONTRATO INDIVIDUAL DE TRABALHO

EMPREGADOR:
Nome/Razão Social: ${contractData.employerName}
CNPJ: ${contractData.employerCnpj}
Endereço: ${contractData.employerAddress}

EMPREGADO:
Nome: ${contractData.employeeName}
CPF: ${contractData.employeeCpf}
Endereço: ${contractData.employeeAddress}

CLÁUSULAS:

1. DO OBJETO
O EMPREGADO prestará serviços na função de ${contractData.position}, subordinado às normas disciplinares e técnicas estabelecidas pelo EMPREGADOR.

2. DA REMUNERAÇÃO
O EMPREGADO receberá salário mensal de R$ ${contractData.salary}, pago até o 5º dia útil do mês subsequente.

3. DA JORNADA DE TRABALHO
A jornada de trabalho será de ${contractData.workSchedule}, de segunda a sexta-feira, conforme necessidades do serviço.

4. DO INÍCIO DA VIGÊNCIA
Este contrato terá início em ${contractData.startDate}, por prazo indeterminado.

5. DAS OBRIGAÇÕES
O EMPREGADO obriga-se a cumprir as normas da empresa e a legislação trabalhista vigente.

6. CLÁUSULAS ADICIONAIS
${contractData.additionalClauses || 'Não há cláusulas adicionais.'}

Local e Data: ________________

_________________________        _________________________
    Empregador                        Empregado

Testemunhas:
1. _________________________
2. _________________________`
        break
        
      case 'temporario':
        template = `CONTRATO DE TRABALHO TEMPORÁRIO

EMPRESA TOMADORA:
Nome/Razão Social: ${contractData.employerName}
CNPJ: ${contractData.employerCnpj}
Endereço: ${contractData.employerAddress}

TRABALHADOR TEMPORÁRIO:
Nome: ${contractData.employeeName}
CPF: ${contractData.employeeCpf}
Endereço: ${contractData.employeeAddress}

CLÁUSULAS:

1. DO OBJETO
Contratação temporária para exercer a função de ${contractData.position}, conforme Lei 6.019/74.

2. DA REMUNERAÇÃO
Salário de R$ ${contractData.salary} mensais, com todos os direitos trabalhistas garantidos.

3. DO PRAZO
Contrato com prazo determinado, iniciando em ${contractData.startDate}, com duração máxima de 180 dias.

4. DA JORNADA
Jornada de trabalho: ${contractData.workSchedule}.

5. CLÁUSULAS ESPECIAIS
${contractData.additionalClauses || 'Aplicam-se as disposições da CLT e Lei 6.019/74.'}

Local e Data: ________________

_________________________        _________________________
    Empresa Tomadora              Trabalhador Temporário`
        break
        
      case 'estagio':
        template = `TERMO DE COMPROMISSO DE ESTÁGIO

EMPRESA CONCEDENTE:
Nome/Razão Social: ${contractData.employerName}
CNPJ: ${contractData.employerCnpj}
Endereço: ${contractData.employerAddress}

ESTAGIÁRIO:
Nome: ${contractData.employeeName}
CPF: ${contractData.employeeCpf}
Endereço: ${contractData.employeeAddress}

CLÁUSULAS:

1. DO ESTÁGIO
Estágio na área de ${contractData.position}, conforme Lei 11.788/2008.

2. DA BOLSA-AUXÍLIO
Bolsa-auxílio mensal de R$ ${contractData.salary}.

3. DO PERÍODO
Início: ${contractData.startDate}
Jornada: ${contractData.workSchedule}

4. DAS ATIVIDADES
O estagiário desenvolverá atividades de aprendizagem profissional supervisionadas.

5. DISPOSIÇÕES ESPECIAIS
${contractData.additionalClauses || 'Aplicam-se as disposições da Lei de Estágio.'}

Local e Data: ________________

_________________________        _________________________
  Empresa Concedente                 Estagiário`
        break
        
      default:
        template = 'Selecione um tipo de contrato para gerar o modelo.'
    }
    
    setGeneratedContract(template)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContract)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadContract = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedContract], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `contrato_${contractData.type}_${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const saveToLocalStorage = () => {
    const contracts = JSON.parse(localStorage.getItem('advjob_contracts') || '[]')
    const newContract = {
      id: Date.now(),
      type: contractData.type,
      employeeName: contractData.employeeName,
      position: contractData.position,
      createdAt: new Date().toISOString(),
      content: generatedContract
    }
    contracts.push(newContract)
    localStorage.setItem('advjob_contracts', JSON.stringify(contracts))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Gerador de Contratos Trabalhistas</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Formulário</TabsTrigger>
              <TabsTrigger value="preview">Visualizar Contrato</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractType">Tipo de Contrato</Label>
                  <Select
                    value={contractData.type}
                    onValueChange={(value) => setContractData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(contractTemplates).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) => setContractData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Dados do Empregador */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Dados do Empregador
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employerName">Nome/Razão Social</Label>
                    <Input
                      id="employerName"
                      value={contractData.employerName}
                      onChange={(e) => setContractData(prev => ({ ...prev, employerName: e.target.value }))}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employerCnpj">CNPJ</Label>
                    <Input
                      id="employerCnpj"
                      value={contractData.employerCnpj}
                      onChange={(e) => setContractData(prev => ({ ...prev, employerCnpj: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employerAddress">Endereço Completo</Label>
                  <Input
                    id="employerAddress"
                    value={contractData.employerAddress}
                    onChange={(e) => setContractData(prev => ({ ...prev, employerAddress: e.target.value }))}
                    placeholder="Endereço completo da empresa"
                  />
                </div>
              </div>

              {/* Dados do Empregado */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Dados do Empregado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Nome Completo</Label>
                    <Input
                      id="employeeName"
                      value={contractData.employeeName}
                      onChange={(e) => setContractData(prev => ({ ...prev, employeeName: e.target.value }))}
                      placeholder="Nome completo do empregado"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeCpf">CPF</Label>
                    <Input
                      id="employeeCpf"
                      value={contractData.employeeCpf}
                      onChange={(e) => setContractData(prev => ({ ...prev, employeeCpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeAddress">Endereço Completo</Label>
                  <Input
                    id="employeeAddress"
                    value={contractData.employeeAddress}
                    onChange={(e) => setContractData(prev => ({ ...prev, employeeAddress: e.target.value }))}
                    placeholder="Endereço completo do empregado"
                  />
                </div>
              </div>

              {/* Dados do Trabalho */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Dados do Trabalho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo/Função</Label>
                    <Input
                      id="position"
                      value={contractData.position}
                      onChange={(e) => setContractData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Ex: Analista de Sistemas"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salário (R$)</Label>
                    <Input
                      id="salary"
                      value={contractData.salary}
                      onChange={(e) => setContractData(prev => ({ ...prev, salary: e.target.value }))}
                      placeholder="Ex: 3.500,00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workSchedule">Jornada de Trabalho</Label>
                    <Input
                      id="workSchedule"
                      value={contractData.workSchedule}
                      onChange={(e) => setContractData(prev => ({ ...prev, workSchedule: e.target.value }))}
                      placeholder="Ex: 8h às 17h"
                    />
                  </div>
                </div>
              </div>

              {/* Cláusulas Adicionais */}
              <div className="space-y-2">
                <Label htmlFor="additionalClauses">Cláusulas Adicionais (Opcional)</Label>
                <Textarea
                  id="additionalClauses"
                  value={contractData.additionalClauses}
                  onChange={(e) => setContractData(prev => ({ ...prev, additionalClauses: e.target.value }))}
                  placeholder="Digite cláusulas específicas ou condições especiais..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={generateContract}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!contractData.type || !contractData.employerName || !contractData.employeeName}
              >
                Gerar Contrato
              </Button>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              {generatedContract ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                    </Button>
                    
                    <Button
                      onClick={downloadContract}
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
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100">
                        {generatedContract}
                      </pre>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Preencha o formulário e clique em "Gerar Contrato" para visualizar o documento.
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