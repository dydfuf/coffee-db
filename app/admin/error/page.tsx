export default function AdminErrorPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">접근이 거부되었습니다</h1>
      <p className="text-muted-foreground mt-2">관리자 권한이 없거나 설정이 올바르지 않습니다.</p>
    </div>
  );
}