const API_BASE = "http://127.0.0.1:8010/api/tasks";
const POLL_INTERVAL_MS = 3000;

let tasks = [];

const statusLabels = {
  todo: "할 일",
  in_progress: "진행 중",
  done: "완료",
};

const statusBadgeClasses = {
  todo: "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-100",
  in_progress: "bg-amber-200 text-amber-800 dark:bg-amber-500/30 dark:text-amber-200",
  done: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200",
};

// ---- 테마 ----
function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", isDark);
  updateThemeIcon(isDark);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  document.getElementById("theme-toggle").textContent = isDark ? "☀️" : "🌙";
}

// ---- 마감 시각 표시 (D-N HH:MM) ----
function formatDueLabel(dueAt) {
  if (!dueAt) return null;
  const due = new Date(dueAt);
  const now = new Date();
  const diffDays = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  const hh = String(due.getHours()).padStart(2, "0");
  const mm = String(due.getMinutes()).padStart(2, "0");
  const dPrefix = diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  return `${dPrefix} ${hh}:${mm}`;
}

// ---- API ----
async function fetchTasks() {
  const res = await fetch(API_BASE);
  tasks = await res.json();
  renderTasks();
}

async function createTask(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("생성 실패");
  await fetchTasks();
}

async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("수정 실패");
  await fetchTasks();
}

async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("삭제 실패");
  await fetchTasks();
}

// ---- 렌더링 ----
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `<p class="text-center text-slate-500 dark:text-slate-400 py-8">등록된 업무가 없습니다.</p>`;
    return;
  }

  for (const task of tasks) {
    const dueLabel = formatDueLabel(task.due_at);
    const card = document.createElement("div");
    card.className =
      "rounded-xl shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur p-4 flex items-center justify-between gap-3 cursor-pointer";
    card.dataset.id = task.id;
    card.innerHTML = `
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-1 rounded-xl text-xs font-medium ${statusBadgeClasses[task.status]}">${statusLabels[task.status]}</span>
          ${dueLabel ? `<span class="text-xs text-slate-500 dark:text-slate-400">${dueLabel}</span>` : ""}
        </div>
        <p class="text-slate-800 dark:text-slate-100 truncate">${escapeHtml(task.title)}</p>
      </div>
      <button
        class="delete-btn w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
        aria-label="삭제"
      >🗑</button>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".delete-btn")) return;
      openEditModal(task);
    });

    card.querySelector(".delete-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      if (confirm(`"${task.title}" 업무를 삭제할까요?`)) {
        await deleteTask(task.id);
      }
    });

    list.appendChild(card);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- 추가 폼 ----
document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("input-title").value.trim();
  const dueAtRaw = document.getElementById("input-due-at").value;
  const status = document.getElementById("input-status").value;

  await createTask({
    title,
    status,
    due_at: dueAtRaw ? new Date(dueAtRaw).toISOString() : null,
  });

  e.target.reset();
});

// ---- 수정 모달 ----
function openEditModal(task) {
  document.getElementById("edit-id").value = task.id;
  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-description").value = task.description || "";
  document.getElementById("edit-status").value = task.status;
  document.getElementById("edit-due-at").value = task.due_at
    ? toDatetimeLocalValue(task.due_at)
    : "";
  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

function toDatetimeLocalValue(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

document.getElementById("edit-cancel").addEventListener("click", closeEditModal);

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const dueAtRaw = document.getElementById("edit-due-at").value;

  await updateTask(id, {
    title: document.getElementById("edit-title").value.trim(),
    description: document.getElementById("edit-description").value,
    status: document.getElementById("edit-status").value,
    due_at: dueAtRaw ? new Date(dueAtRaw).toISOString() : null,
  });

  closeEditModal();
});

// ---- 초기화 ----
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

initTheme();
fetchTasks();
setInterval(fetchTasks, POLL_INTERVAL_MS);
