export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-7rem)] text-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
          403 - Unauthorized
        </h1>
        <p>You do not have permission to view this page.</p>

        <img src="/403.png" className="w-[280px]" />
      </div>
    </div>
  );
}
