"use client"

import { useTransition } from "react"
import { saveAiApiKey, removeAiApiKey } from "./actions"

interface AiSettingsFormProps {
  orgId: string
  hasApiKey: boolean
}

export function AiSettingsForm({ orgId, hasApiKey }: AiSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveAiApiKey(formData)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await removeAiApiKey(orgId)
    })
  }

  return (
    <div className="space-y-6">
      {hasApiKey && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700 text-sm font-medium">
            Chave OpenRouter configurada
          </span>
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="ml-auto text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Remover
          </button>
        </div>
      )}

      <form action={handleSave} className="space-y-4">
        <input type="hidden" name="orgId" value={orgId} />
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            {hasApiKey ? "Substituir chave OpenRouter" : "Chave OpenRouter"}
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            placeholder="sk-or-v1-..."
            required
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-muted-foreground">
            Sua chave é armazenada criptografada com AES-256-GCM.
            Obtenha em{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              openrouter.ai/keys
            </a>
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white text-sm rounded-lg disabled:opacity-50 hover:bg-gray-800"
        >
          {isPending ? "Salvando..." : "Salvar chave"}
        </button>
      </form>
    </div>
  )
}
