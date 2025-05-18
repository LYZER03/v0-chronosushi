import { DashboardLayout } from "@/components/dashboard-layout"
import { PageEditor } from "@/components/page-editor"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: PageProps) {
  // Ensure params are resolved before using them
  const { id } = await Promise.resolve(params)
  
  return (
    <DashboardLayout>
      <PageEditor pageId={id} />
    </DashboardLayout>
  )
}
