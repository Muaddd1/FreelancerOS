'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Upload, File, Download, Trash2, FileText, Image, Film, Archive } from 'lucide-react'

export default function FilesPage() {
  const [files, setFiles] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/files').then(r => r.json()).then(d => { setFiles(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles?.length) return
    setUploading(true)
    try {
      for (const file of uploadedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/files', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          setFiles(prev => [data, ...prev])
        }
      }
      toast.success('Files uploaded')
    } catch { toast.error('Failed to upload files') } finally { setUploading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return
    await fetch(`/api/files/${id}`, { method: 'DELETE' })
    toast.success('File deleted')
    setFiles(files.filter(f => f.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type?.startsWith('image')) return <Image className="w-4 h-4 text-muted-foreground" />
    if (type?.startsWith('video')) return <Film className="w-4 h-4 text-muted-foreground" />
    if (type?.includes('zip') || type?.includes('archive')) return <Archive className="w-4 h-4 text-muted-foreground" />
    if (type?.includes('pdf') || type?.includes('doc')) return <FileText className="w-4 h-4 text-muted-foreground" />
    return <File className="w-4 h-4 text-muted-foreground" />
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <DashboardHeader title="Files" description="Manage your files" />
      <div>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-[#0F0F12] text-white dark:text-[#0F0F12] rounded-lg text-sm font-medium cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {files.length === 0 ? (
        <div className="text-center py-16">
          <File className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No files yet</h3>
          <p className="text-xs text-muted-foreground">Upload your first file.</p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-[#0A0A0D] transition-colors">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)} · {formatDate(file.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {file.url && <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4" /></a>
                </Button>}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(file.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
