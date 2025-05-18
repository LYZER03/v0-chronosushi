import { DashboardLayout } from "@/components/dashboard-layout"
import { PageEditor } from "@/components/page-editor"

type PageProps = {
  params: { id: string }
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params)
  
  return (
    <DashboardLayout>
      <PageEditor pageId={id} />
    </DashboardLayout>
  )
}
