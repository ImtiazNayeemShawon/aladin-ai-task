import { Link } from "react-router-dom";

export default function sandboxCard({ sandbox }: { sandbox: any }) {
    return (
        <div>
            <div className="w-full max-w-xl bg-zinc-900 shadow-lg rounded-2xl p-5 ">
                {/* Header */}
                <div className="mb-3">
                    <h2 className="text-xl font-bold text-gray-100">{sandbox.title}</h2>
                    <p className="text-gray-100 text-sm">{sandbox.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {sandbox.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-gray-400 text-gray-100 rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-200 mb-4">
                    <p>Created: {new Date(sandbox.createdAt).toLocaleString()}</p>
                    <p>Updated: {new Date(sandbox.updatedAt).toLocaleString()}</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                    <Link
                        to={"/editor?sandboxId=" + sandbox.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Open Editor ↗
                    </Link>
                </div>
            </div>
        </div>
    )
}
