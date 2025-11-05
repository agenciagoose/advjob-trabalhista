"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Shield, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o Supabase está configurado
    const checkSupabaseConfig = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key || url === 'https://placeholder.supabase.co' || key === 'placeholder-key') {
        setSupabaseConfigured(false)
        setLoading(false)
        return false
      }
      
      setSupabaseConfigured(true)
      return true
    }

    if (!checkSupabaseConfig()) {
      return
    }

    // Verificar se usuário já está logado
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error('Erro ao verificar usuário:', error)
        setLoading(false)
        return
      }
      
      setUser(user)
      setLoading(false)
      if (user) {
        router.push('/dashboard')
      }
    }).catch((error) => {
      console.error('Erro na verificação de usuário:', error)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Configuração Necessária
            </CardTitle>
            <CardDescription>
              As variáveis do Supabase não estão configuradas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ Para usar a autenticação, você precisa configurar suas credenciais do Supabase.
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Para configurar:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Clique no banner laranja que aparece no topo da tela</li>
                <li>Ou vá em Configurações → Integrações → Supabase</li>
                <li>Conecte sua conta do Supabase</li>
              </ol>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Início
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecionando para o dashboard...</p>
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
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Lado esquerdo - Informações */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Bem-vindo ao
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AdvJob
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                A primeira assistente de IA especializada em Direito Trabalhista do Brasil. 
                Faça login para acessar todas as funcionalidades.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Chat IA Especializada</h3>
                  <p className="text-slate-600">
                    Converse com nossa IA treinada exclusivamente em Direito Trabalhista
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Segurança Total</h3>
                  <p className="text-slate-600">
                    Seus dados protegidos com criptografia e conformidade com LGPD
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Acesso Completo</h3>
                  <p className="text-slate-600">
                    Contratos, relatórios, base de conhecimento e muito mais
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Formulário de Login */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Faça seu login
                </CardTitle>
                <CardDescription className="text-lg">
                  Entre na sua conta para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#2563eb',
                          brandAccent: '#1d4ed8',
                          brandButtonText: 'white',
                          defaultButtonBackground: '#f8fafc',
                          defaultButtonBackgroundHover: '#f1f5f9',
                          inputBackground: 'white',
                          inputBorder: '#e2e8f0',
                          inputBorderHover: '#cbd5e1',
                          inputBorderFocus: '#2563eb',
                        },
                        space: {
                          spaceSmall: '4px',
                          spaceMedium: '8px',
                          spaceLarge: '16px',
                          labelBottomMargin: '8px',
                          anchorBottomMargin: '4px',
                          emailInputSpacing: '4px',
                          socialAuthSpacing: '4px',
                          buttonPadding: '10px 15px',
                          inputPadding: '10px 15px',
                        },
                        fontSizes: {
                          baseBodySize: '14px',
                          baseInputSize: '14px',
                          baseLabelSize: '14px',
                          baseButtonSize: '14px',
                        },
                        fonts: {
                          bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                        },
                        borderWidths: {
                          buttonBorderWidth: '1px',
                          inputBorderWidth: '1px',
                        },
                        radii: {
                          borderRadiusButton: '8px',
                          buttonBorderRadius: '8px',
                          inputBorderRadius: '8px',
                        },
                      },
                    },
                    className: {
                      container: 'space-y-4',
                      label: 'text-sm font-medium text-slate-700',
                      button: 'w-full transition-all duration-200 font-medium shadow-sm hover:shadow-md',
                      input: 'w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
                      anchor: 'text-blue-600 hover:text-blue-700 text-sm font-medium',
                      divider: 'text-slate-400',
                      message: 'text-sm',
                    },
                  }}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email',
                        password_label: 'Senha',
                        email_input_placeholder: 'Seu email',
                        password_input_placeholder: 'Sua senha',
                        button_label: 'Entrar',
                        loading_button_label: 'Entrando...',
                        social_provider_text: 'Entrar com {{provider}}',
                        link_text: 'Já tem uma conta? Entre aqui',
                      },
                      sign_up: {
                        email_label: 'Email',
                        password_label: 'Senha',
                        email_input_placeholder: 'Seu email',
                        password_input_placeholder: 'Sua senha',
                        button_label: 'Criar conta',
                        loading_button_label: 'Criando conta...',
                        social_provider_text: 'Criar conta com {{provider}}',
                        link_text: 'Não tem uma conta? Crie aqui',
                        confirmation_text: 'Verifique seu email para confirmar a conta',
                      },
                      forgotten_password: {
                        email_label: 'Email',
                        password_label: 'Senha',
                        email_input_placeholder: 'Seu email',
                        button_label: 'Enviar instruções',
                        loading_button_label: 'Enviando...',
                        link_text: 'Esqueceu sua senha?',
                        confirmation_text: 'Verifique seu email para redefinir a senha',
                      },
                      update_password: {
                        password_label: 'Nova senha',
                        password_input_placeholder: 'Sua nova senha',
                        button_label: 'Atualizar senha',
                        loading_button_label: 'Atualizando...',
                        confirmation_text: 'Sua senha foi atualizada',
                      },
                      verify_otp: {
                        email_input_label: 'Email',
                        email_input_placeholder: 'Seu email',
                        phone_input_label: 'Telefone',
                        phone_input_placeholder: 'Seu telefone',
                        token_input_label: 'Código',
                        token_input_placeholder: 'Código de verificação',
                        button_label: 'Verificar código',
                        loading_button_label: 'Verificando...',
                      },
                    },
                  }}
                  providers={['google', 'github']}
                  redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard'}
                  onlyThirdPartyProviders={false}
                  magicLink={true}
                  showLinks={true}
                />
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Ao fazer login, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}