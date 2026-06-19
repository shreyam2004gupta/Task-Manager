import React from "react"

const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.label === activeTab

        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab?.(tab.label)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">{tab.label}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[24px] h-5 px-2 rounded-full text-xs font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.count ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TaskStatusTabs

