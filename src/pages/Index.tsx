import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconPosition = "left" | "right" | "none";
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type EventType = "click" | "hover" | "focus" | "blur" | "dblclick";
type ActionType = "navigate" | "api_call" | "show_modal" | "submit_form" | "copy" | "custom";

interface NestedAction {
  id: string;
  type: ActionType;
  value: string;
}

interface Action {
  id: string;
  type: ActionType;
  value: string;
  nestedActions: NestedAction[];
  nestedOpen: boolean;
}

interface EventConfig {
  id: string;
  type: EventType;
  actions: Action[];
}

interface ButtonConfig {
  label: string;
  variant: ButtonVariant;
  iconName: string;
  iconPosition: IconPosition;
  disabled: boolean;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "click", label: "Клик по элементу" },
  { value: "hover", label: "Наведение" },
  { value: "focus", label: "Фокус" },
  { value: "blur", label: "Потеря фокуса" },
  { value: "dblclick", label: "Двойной клик" },
];

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: "navigate", label: "Навигация" },
  { value: "api_call", label: "API запрос" },
  { value: "show_modal", label: "Показать модал" },
  { value: "submit_form", label: "Отправить форму" },
  { value: "copy", label: "Копировать" },
  { value: "custom", label: "Кастомный" },
];

const BUTTON_VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "danger", label: "Danger" },
];

const ICON_OPTIONS = [
  "none", "ArrowRight", "ArrowLeft", "Check", "X", "Plus", "Minus",
  "Send", "Download", "Upload", "Search", "Star", "Heart", "Bell",
  "Settings", "Trash2", "Edit", "Eye", "Lock", "Unlock",
];

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function eventLabel(type: EventType) {
  return EVENT_TYPES.find(e => e.value === type)?.label ?? type;
}

// ─── UI primitives ───────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[12px] text-[#6b7280] mb-1 font-medium">{children}</span>
  );
}

function BlueSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-[#d1e3f8] rounded-lg px-3 py-[9px] text-[13px] text-[#1a2233] focus:outline-none focus:border-[#4a9eed] focus:ring-2 focus:ring-[#4a9eed]/20 transition-all cursor-pointer pr-8"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4a9eed]">
        <Icon name="ChevronDown" size={14} />
      </div>
    </div>
  );
}

function BlueInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-[#d1e3f8] rounded-lg px-3 py-[9px] text-[13px] text-[#1a2233] placeholder:text-[#a0b3c8] focus:outline-none focus:border-[#4a9eed] focus:ring-2 focus:ring-[#4a9eed]/20 transition-all"
    />
  );
}

function AddActionBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white bg-[#4a9eed] hover:bg-[#3b8fde] transition-colors"
    >
      <Icon name="Plus" size={12} />
      {label}
    </button>
  );
}

function TrashBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center text-[#b0c4d8] hover:text-[#e53e3e] hover:bg-red-50 rounded transition-all"
    >
      <Icon name="Trash2" size={14} />
    </button>
  );
}



// ─── Action block ────────────────────────────────────────────────

function ActionBlock({ action, index, onChange, onRemove }: {
  action: Action;
  index: number;
  onChange: (a: Action) => void;
  onRemove: () => void;
}) {
  const addNested = () => onChange({
    ...action,
    nestedOpen: true,
    nestedActions: [{ id: uid(), type: "navigate", value: "" }, ...action.nestedActions],
  });

  return (
    <div className="rounded-xl overflow-hidden border border-[#d1e3f8] bg-white animate-[fade-in_0.15s_ease-out]">

      {/* ── Action header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0f7ff] border-b border-[#d1e3f8]">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#4a9eed] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <span className="text-[13px] font-semibold text-[#1a2233]">Действие</span>
        </div>
        <TrashBtn onClick={onRemove} />
      </div>

      {/* ── Action fields ── */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div>
          <Label>Тип действия:</Label>
          <BlueSelect
            value={action.type}
            onChange={v => onChange({ ...action, type: v as ActionType })}
            options={ACTION_TYPES}
            placeholder="Выберите тип"
          />
        </div>
        <div>
          <Label>Значение:</Label>
          <BlueInput
            value={action.value}
            onChange={v => onChange({ ...action, value: v })}
            placeholder="Введите значение"
          />
        </div>
      </div>

      {/* ── Nested zone ── */}
      <div className="bg-[#f4faff] border-t border-[#d1e3f8] px-4 py-3">

        {/* Header row — label + counter. Add button only when items exist */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Icon name="CornerDownRight" size={13} />
            <span className="text-[12px] font-semibold text-[#4a6280]">
              При успехе
            </span>
            {action.nestedActions.length > 0 && (
              <span className="text-[10px] font-mono bg-[#dbeeff] text-[#1a6ebd] px-1.5 py-0.5 rounded-full">
                {action.nestedActions.length}
              </span>
            )}
          </div>
          {action.nestedActions.length > 0 && (
            <button
              onClick={addNested}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#4a9eed] hover:text-[#1a6ebd] hover:bg-[#dbeeff] px-2 py-1 rounded-lg transition-colors"
            >
              <Icon name="Plus" size={11} />
              Добавить
            </button>
          )}
        </div>

        {/* Empty state — single CTA */}
        {action.nestedActions.length === 0 && (
          <button
            onClick={addNested}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-[#b8d8f5] bg-white hover:bg-[#f0f7ff] hover:border-[#4a9eed] transition-all group"
          >
            <span className="w-6 h-6 rounded-full bg-[#dbeeff] group-hover:bg-[#4a9eed] flex items-center justify-center transition-colors flex-shrink-0">
              <Icon name="Plus" size={11} className="text-[#4a9eed] group-hover:text-white" />
            </span>
            <span className="text-[12px] text-[#7fa8c8] group-hover:text-[#4a9eed] font-medium transition-colors text-left">
              Добавить действие, которое выполнится при успехе
            </span>
          </button>
        )}

        {/* Nested list */}
        {action.nestedActions.length > 0 && (
          <div className="flex flex-col gap-2">
            {action.nestedActions.map((na, i) => (
              <div
                key={na.id}
                className="flex gap-2 items-start pl-3 border-l-2 border-[#4a9eed]/30 animate-[fade-in_0.15s_ease-out]"
              >
                <div className="flex-1 bg-white rounded-lg border border-[#d1e3f8] px-3 py-2.5 grid grid-cols-2 gap-2">
                  <div>
                    <Label>Тип:</Label>
                    <BlueSelect
                      value={na.type}
                      onChange={v => {
                        const list = [...action.nestedActions];
                        list[i] = { ...na, type: v as ActionType };
                        onChange({ ...action, nestedActions: list });
                      }}
                      options={ACTION_TYPES}
                    />
                  </div>
                  <div>
                    <Label>Значение:</Label>
                    <BlueInput
                      value={na.value}
                      onChange={v => {
                        const list = [...action.nestedActions];
                        list[i] = { ...na, value: v };
                        onChange({ ...action, nestedActions: list });
                      }}
                      placeholder="Введите значение"
                    />
                  </div>
                </div>
                <button
                  onClick={() =>
                    onChange({ ...action, nestedActions: action.nestedActions.filter((_, idx) => idx !== i) })
                  }
                  className="mt-1 w-6 h-6 flex items-center justify-center text-[#b0c4d8] hover:text-[#e53e3e] hover:bg-red-50 rounded transition-all flex-shrink-0"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel: Event detail ─────────────────────────────────────────

function EventPanel({ event, onChange }: {
  event: EventConfig;
  onChange: (e: EventConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Event title + fields */}
      <div>
        <h2 className="text-[16px] font-bold text-[#1a2233] mb-4">
          Событие ({eventLabel(event.type)})
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Тип события:</Label>
            <BlueSelect
              value={event.type}
              onChange={v => onChange({ ...event, type: v as EventType })}
              options={EVENT_TYPES}
            />
          </div>
          <div>
            <Label>Область:</Label>
            <BlueSelect
              value=""
              onChange={() => {}}
              options={[{ value: "area1", label: "area 1" }, { value: "area2", label: "area 2" }]}
              placeholder="Выберите область"
            />
          </div>
        </div>
      </div>

      {/* Actions section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[#1a2233]">Действия</h3>
          <AddActionBtn
            onClick={() => onChange({
              ...event,
              actions: [
                { id: uid(), type: "navigate", value: "", nestedActions: [], nestedOpen: false },
                ...event.actions,
              ],
            })}
            label="Добавить действие"
          />
        </div>

        <div className="flex flex-col gap-3">
          {event.actions.length === 0 && (
            <p className="text-[13px] text-[#aabfd4] py-3">Нет действий — добавьте первое</p>
          )}
          {event.actions.map((action, ai) => (
            <ActionBlock
              key={action.id}
              action={action}
              index={ai}
              onChange={updated => {
                const list = [...event.actions];
                list[ai] = updated;
                onChange({ ...event, actions: list });
              }}
              onRemove={() =>
                onChange({ ...event, actions: event.actions.filter((_, idx) => idx !== ai) })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Panel: Button settings ──────────────────────────────────────

function ButtonPanel({ config, onChange }: {
  config: ButtonConfig;
  onChange: (c: ButtonConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[16px] font-bold text-[#1a2233]">Базовые настройки</h2>

      <div>
        <Label>Надпись на кнопке:</Label>
        <BlueInput
          value={config.label}
          onChange={v => onChange({ ...config, label: v })}
          placeholder="Текст кнопки"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Тип кнопки:</Label>
          <BlueSelect
            value={config.variant}
            onChange={v => onChange({ ...config, variant: v as ButtonVariant })}
            options={BUTTON_VARIANTS}
          />
        </div>
        <div>
          <Label>Иконка:</Label>
          <BlueSelect
            value={config.iconName}
            onChange={v => onChange({ ...config, iconName: v })}
            options={ICON_OPTIONS.map(i => ({ value: i, label: i === "none" ? "— Без иконки" : i }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Позиция иконки:</Label>
          <BlueSelect
            value={config.iconPosition}
            onChange={v => onChange({ ...config, iconPosition: v as IconPosition })}
            options={[
              { value: "left", label: "← Слева" },
              { value: "right", label: "Справа →" },
              { value: "none", label: "Без позиции" },
            ]}
          />
        </div>
        <div>
          <Label>Состояние:</Label>
          <BlueSelect
            value={config.disabled ? "disabled" : "enabled"}
            onChange={v => onChange({ ...config, disabled: v === "disabled" })}
            options={[
              { value: "enabled", label: "Активна" },
              { value: "disabled", label: "Заблокирована" },
            ]}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border border-[#d1e3f8] rounded-xl p-6 bg-[#f8fbff] flex items-center justify-center mt-2">
        <button
          disabled={config.disabled}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            config.variant === "primary" ? "bg-[#4a9eed] text-white hover:bg-[#3b8fde]"
            : config.variant === "secondary" ? "bg-white text-[#4a9eed] border border-[#4a9eed] hover:bg-[#f0f7ff]"
            : config.variant === "ghost" ? "bg-transparent text-[#4a9eed] hover:bg-[#f0f7ff]"
            : "bg-[#e53e3e] text-white hover:opacity-90"
          }`}
        >
          {config.iconPosition === "left" && config.iconName !== "none" && (
            <Icon name={config.iconName} size={15} fallback="CircleAlert" />
          )}
          {config.label || "Кнопка"}
          {config.iconPosition === "right" && config.iconName !== "none" && (
            <Icon name={config.iconName} size={15} fallback="CircleAlert" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────

type SidebarItem =
  | { kind: "base" }
  | { kind: "event"; idx: number };

export default function Index() {
  const [btnConfig, setBtnConfig] = useState<ButtonConfig>({
    label: "Отправить",
    variant: "primary",
    iconName: "Send",
    iconPosition: "right",
    disabled: false,
  });

  const [events, setEvents] = useState<EventConfig[]>([
    {
      id: uid(),
      type: "click",
      actions: [
        {
          id: uid(), type: "api_call", value: "/api/submit",
          nestedActions: [{ id: uid(), type: "show_modal", value: "success_modal" }],
          nestedOpen: true,
        },
      ],
    },
  ]);

  const [active, setActive] = useState<SidebarItem>({ kind: "base" });

  const addEvent = () => {
    const newEvent: EventConfig = { id: uid(), type: "click", actions: [] };
    setEvents(ev => [newEvent, ...ev]);
    setActive({ kind: "event", idx: 0 });
  };

  const removeEvent = (idx: number) => {
    setEvents(ev => ev.filter((_, i) => i !== idx));
    setActive({ kind: "base" });
  };

  const updateEvent = (idx: number, updated: EventConfig) => {
    setEvents(ev => { const l = [...ev]; l[idx] = updated; return l; });
  };

  const isActive = (item: SidebarItem) => {
    if (item.kind === "base" && active.kind === "base") return true;
    if (item.kind === "event" && active.kind === "event" && item.idx === active.idx) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#e8f2fc] flex items-center justify-center p-6 font-sans">
      {/* Modal — fixed 900px height */}
      <div className="w-full max-w-[860px] bg-white rounded-2xl shadow-2xl shadow-[#4a9eed]/10 overflow-hidden flex flex-col" style={{ height: 900 }}>

        {/* Header — fixed */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-b border-[#e8f2fc]">
          <h1 className="text-[17px] font-bold text-[#1a2233] tracking-tight">Настройка кнопки</h1>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-[#4a9eed] hover:bg-[#f0f7ff] rounded-lg transition-colors">
              <Icon name="Save" size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#b0c4d8] hover:text-[#e53e3e] hover:bg-red-50 rounded-lg transition-colors">
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Body — fills remaining height */}
        <div className="flex flex-1 min-h-0">

          {/* Sidebar — independent scroll */}
          <div className="w-[190px] flex-shrink-0 border-r border-[#e8f2fc] flex flex-col overflow-y-auto">

            {/* ── Section: Settings ── */}
            <div className="px-3 pt-4 pb-2">
              <span className="block text-[10px] font-bold tracking-widest uppercase text-[#a0b8d0] px-1 mb-1">
                Настройки
              </span>
              <button
                onClick={() => setActive({ kind: "base" })}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive({ kind: "base" })
                    ? "bg-[#dbeeff] text-[#1a6ebd]"
                    : "text-[#4a6280] hover:bg-[#f0f7ff]"
                }`}
              >
                <Icon name="Settings2" size={13} />
                Базовые
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="mx-3 border-t border-[#e8f2fc]" />

            {/* ── Section: Events ── */}
            <div className="px-3 pt-3 pb-3 flex flex-col flex-1 gap-0.5">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#a0b8d0]">
                  События
                </span>
                <button
                  onClick={addEvent}
                  title="Добавить событие"
                  className="w-5 h-5 flex items-center justify-center rounded-md text-[#4a9eed] hover:bg-[#dbeeff] transition-colors"
                >
                  <Icon name="Plus" size={13} />
                </button>
              </div>

              {events.length === 0 && (
                <button
                  onClick={addEvent}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#c5dcf5] text-[12px] text-[#7fa8c8] hover:text-[#4a9eed] hover:border-[#4a9eed] hover:bg-[#f0f7ff] transition-all"
                >
                  <Icon name="Plus" size={12} />
                  Добавить событие
                </button>
              )}

              {events.map((event, i) => (
                <div key={event.id} className="group relative">
                  <button
                    onClick={() => setActive({ kind: "event", idx: i })}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors pr-7 ${
                      isActive({ kind: "event", idx: i })
                        ? "bg-[#dbeeff] text-[#1a6ebd]"
                        : "text-[#4a6280] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    <Icon name="Zap" size={12} className="flex-shrink-0 opacity-60" />
                    <span className="truncate">{eventLabel(event.type)}</span>
                    {event.actions.length > 0 && (
                      <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        isActive({ kind: "event", idx: i }) ? "bg-[#4a9eed]/20 text-[#1a6ebd]" : "bg-[#e8f2fc] text-[#7fa8c8]"
                      }`}>
                        {event.actions.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => removeEvent(i)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-[#b0c4d8] hover:text-[#e53e3e] transition-all rounded"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content — independent scroll */}
          <div className="flex-1 overflow-y-auto px-7 py-6">
            {active.kind === "base" && (
              <ButtonPanel config={btnConfig} onChange={setBtnConfig} />
            )}
            {active.kind === "event" && events[active.idx] && (
              <EventPanel
                key={events[active.idx].id}
                event={events[active.idx]}
                onChange={updated => updateEvent(active.idx, updated)}
              />
            )}
          </div>
        </div>

        {/* Footer — fixed */}
        <div className="flex-shrink-0 flex justify-end px-7 py-4 border-t border-[#e8f2fc]">
          <button className="px-6 py-2 bg-[#4a9eed] text-white text-[14px] font-semibold rounded-lg hover:bg-[#3b8fde] transition-colors">
            Сохранить
          </button>
        </div>

      </div>
    </div>
  );
}