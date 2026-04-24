export default function LoadingSpinner({ size = 32 }) {
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full border-4 border-gray-200 border-t-brand-500 animate-spin"
        />
    );
}
