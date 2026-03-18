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

const BUTTON_VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "danger", label: "Danger" },
];

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "click", label: "click" },
  { value: "hover", label: "hover" },
  { value: "focus", label: "focus" },
  { value: "blur", label: "blur" },
  { value: "dblclick", label: "dblclick" },
];

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: "navigate", label: "Навигация" },
  { value: "api_call", label: "API запрос" },
  { value: "show_modal", label: "Показать модал" },
  { value: "submit_form", label: "Отправить форму" },
  { value: "copy", label: "Копировать" },
  { value: "custom", label: "Кастомный" },
];

const ICON_OPTIONS = [
  "none", "ArrowRight", "ArrowLeft", "Check", "X", "Plus", "Minus",
  "Send", "Download", "Upload", "Search", "Star", "Heart", "Bell",
  "Settings", "Trash2", "Edit", "Eye", "Lock", "Unlock",
];

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function ButtonPreview({ config }: { config: ButtonConfig }) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#0f0f0f] text-white hover:bg-[#2a2a2a]",
    secondary: "bg-transparent text-[#0f0f0f] border border-[#0f0f0f] hover:bg-[#f0f0f0]",
    ghost: "bg-transparent text-[#555] hover:bg-[#f5f5f5]",
    danger: "bg-[#e53e3e] text-white hover:opacity-90",
  };

  return (
    <button
      disabled={config.disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[config.variant]}`}
    >
      {config.iconPosition === "left" && config.iconName !== "none" && (
        <Icon name={config.iconName} size={15} fallback="CircleAlert" />
      )}
      {config.label || "Кнопка"}
      {config.iconPosition === "right" && config.iconName !== "none" && (
        <Icon name={config.iconName} size={15} fallback="CircleAlert" />
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#999]">{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border border-[#e4e4e4] rounded-lg px-3 py-2 text-sm text-[#0f0f0f] placeholder:text-[#ccc] focus:outline-none focus:border-[#0f0f0f] transition-colors"
    />
  );
}

function StyledSelect({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-[#e4e4e4] rounded-lg px-3 py-2 text-sm text-[#0f0f0f] focus:outline-none focus:border-[#0f0f0f] transition-colors appearance-none cursor-pointer pr-8"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#bbb]">
        <Icon name="ChevronDown" size={12} />
      </div>
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-medium text-[#aaa] hover:text-[#0f0f0f] transition-colors py-1 group"
    >
      <span className="w-5 h-5 rounded border border-[#e4e4e4] flex items-center justify-center group-hover:border-[#0f0f0f] transition-colors">
        <Icon name="Plus" size={10} />
      </span>
      {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#ccc] hover:text-[#e53e3e] transition-colors rounded"
    >
      <Icon name="X" size={12} />
    </button>
  );
}

function MonoTag({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] bg-[#f3f3f3] text-[#888] px-1.5 py-0.5 rounded whitespace-nowrap">
      {label}
    </span>
  );
}

function NestedActionRow({
  action, onChange, onRemove,
}: {
  action: NestedAction;
  onChange: (a: NestedAction) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 items-center pl-4 animate-[fade-in_0.15s_ease-out]">
      <div className="text-[#ddd]">
        <Icon name="CornerDownRight" size={12} />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <StyledSelect
          value={action.type}
          onChange={v => onChange({ ...action, type: v as ActionType })}
          options={ACTION_TYPES}
        />
        <StyledInput
          value={action.value}
          onChange={v => onChange({ ...action, value: v })}
          placeholder="Значение"
        />
      </div>
      <RemoveBtn onClick={onRemove} />
    </div>
  );
}

function ActionRow({
  action, onChange, onRemove,
}: {
  action: Action;
  onChange: (a: Action) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-[#eee] rounded-lg overflow-hidden animate-[fade-in_0.15s_ease-out]">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#fafafa]">
        <button
          onClick={() => setOpen(o => !o)}
          className="text-[#ccc] hover:text-[#555] transition-colors flex-shrink-0"
        >
          <Icon name={open ? "ChevronDown" : "ChevronRight"} size={13} />
        </button>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <StyledSelect
            value={action.type}
            onChange={v => onChange({ ...action, type: v as ActionType })}
            options={ACTION_TYPES}
          />
          <StyledInput
            value={action.value}
            onChange={v => onChange({ ...action, value: v })}
            placeholder="Значение"
          />
        </div>
        {action.nestedActions.length > 0 && (
          <MonoTag label={`${action.nestedActions.length} вложен.`} />
        )}
        <RemoveBtn onClick={onRemove} />
      </div>

      {open && (
        <div className="px-3 pb-3 pt-1.5 flex flex-col gap-2 bg-white">
          <div className="pl-4">
            <AddBtn
              onClick={() =>
                onChange({
                  ...action,
                  nestedActions: [{ id: uid(), type: "navigate", value: "" }, ...action.nestedActions],
                })
              }
              label="Вложенное действие"
            />
          </div>
          {action.nestedActions.map((na, i) => (
            <NestedActionRow
              key={na.id}
              action={na}
              onChange={updated => {
                const list = [...action.nestedActions];
                list[i] = updated;
                onChange({ ...action, nestedActions: list });
              }}
              onRemove={() =>
                onChange({ ...action, nestedActions: action.nestedActions.filter((_, idx) => idx !== i) })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventRow({
  event, onChange, onRemove,
}: {
  event: EventConfig;
  onChange: (e: EventConfig) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-[#e4e4e4] rounded-xl overflow-hidden animate-[fade-in_0.2s_ease-out]">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f8f8f8]">
        <button
          onClick={() => setOpen(o => !o)}
          className="text-[#ccc] hover:text-[#555] transition-colors flex-shrink-0"
        >
          <Icon name={open ? "ChevronDown" : "ChevronRight"} size={14} />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <div className="w-40">
            <StyledSelect
              value={event.type}
              onChange={v => onChange({ ...event, type: v as EventType })}
              options={EVENT_TYPES}
            />
          </div>
          <span className="font-mono text-[10px] text-[#bbb]">→</span>
          <MonoTag label={`${event.actions.length} действ.`} />
        </div>

        <RemoveBtn onClick={onRemove} />
      </div>

      {open && (
        <div className="p-4 flex flex-col gap-3 bg-white">
          {event.actions.length === 0 && (
            <p className="text-[13px] text-[#ccc] text-center py-2">Нет действий</p>
          )}
          {event.actions.map((action, i) => (
            <ActionRow
              key={action.id}
              action={action}
              onChange={updated => {
                const list = [...event.actions];
                list[i] = updated;
                onChange({ ...event, actions: list });
              }}
              onRemove={() =>
                onChange({ ...event, actions: event.actions.filter((_, idx) => idx !== i) })
              }
            />
          ))}
          <AddBtn
            onClick={() =>
              onChange({
                ...event,
                actions: [
                  ...event.actions,
                  { id: uid(), type: "navigate", value: "", nestedActions: [] },
                ],
              })
            }
            label="Добавить действие"
          />
        </div>
      )}
    </div>
  );
}

type TabId = "button" | "events";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("button");
  const [activeEvent, setActiveEvent] = useState(0);

  const [config, setConfig] = useState<ButtonConfig>({
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
          id: uid(),
          type: "api_call",
          value: "/api/submit",
          nestedActions: [
            { id: uid(), type: "show_modal", value: "success_modal" },
          ],
        },
      ],
    },
  ]);

  const tabs: { id: TabId; label: string; icon: string; count?: number }[] = [
    { id: "button", label: "Кнопка", icon: "Square" },
    { id: "events", label: "События", icon: "Zap", count: events.length },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f] font-sans">
      <div className="max-w-[640px] mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#bbb] mb-2">
            Конфигуратор
          </p>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0f0f0f]">
            Настройка кнопки
          </h1>
        </div>

        {/* Preview */}
        <div className="mb-10 px-8 py-10 border border-[#f0f0f0] rounded-2xl flex items-center justify-center bg-[#fafafa] min-h-[100px]">
          <ButtonPreview config={config} />
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-[#ebebeb]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? "border-[#0f0f0f] text-[#0f0f0f]"
                  : "border-transparent text-[#aaa] hover:text-[#555]"
              }`}
            >
              <Icon name={tab.icon} size={13} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  activeTab === tab.id ? "bg-[#0f0f0f] text-white" : "bg-[#f0f0f0] text-[#999]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Panel: Button */}
        {activeTab === "button" && (
          <div className="flex flex-col gap-7 animate-[fade-in_0.2s_ease-out]">

            <Field label="Надпись на кнопке">
              <StyledInput
                value={config.label}
                onChange={v => setConfig(c => ({ ...c, label: v }))}
                placeholder="Текст кнопки"
              />
            </Field>

            <Field label="Тип кнопки">
              <div className="grid grid-cols-4 gap-2">
                {BUTTON_VARIANTS.map(v => (
                  <button
                    key={v.value}
                    onClick={() => setConfig(c => ({ ...c, variant: v.value }))}
                    className={`py-2 rounded-lg text-[13px] font-medium border transition-all ${
                      config.variant === v.value
                        ? "border-[#0f0f0f] text-[#0f0f0f] bg-[#f5f5f5]"
                        : "border-[#e4e4e4] text-[#aaa] hover:border-[#aaa] hover:text-[#555]"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Иконка">
                <StyledSelect
                  value={config.iconName}
                  onChange={v => setConfig(c => ({ ...c, iconName: v }))}
                  options={ICON_OPTIONS.map(i => ({ value: i, label: i === "none" ? "— Без иконки" : i }))}
                />
              </Field>

              <Field label="Позиция иконки">
                <div className="grid grid-cols-3 gap-1.5">
                  {(["left", "right", "none"] as IconPosition[]).map(pos => (
                    <button
                      key={pos}
                      onClick={() => setConfig(c => ({ ...c, iconPosition: pos }))}
                      className={`py-2 rounded-lg text-[12px] font-medium border transition-all ${
                        config.iconPosition === pos
                          ? "border-[#0f0f0f] text-[#0f0f0f] bg-[#f5f5f5]"
                          : "border-[#e4e4e4] text-[#aaa] hover:border-[#aaa]"
                      }`}
                    >
                      {pos === "left" ? "← Лево" : pos === "right" ? "Право →" : "Нет"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-[#f0f0f0]">
              <div>
                <p className="text-sm text-[#333]">Заблокирована</p>
                <p className="text-[12px] text-[#bbb] mt-0.5">Кнопка недоступна для нажатия</p>
              </div>
              <button
                onClick={() => setConfig(c => ({ ...c, disabled: !c.disabled }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  config.disabled ? "bg-[#0f0f0f]" : "bg-[#e4e4e4]"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  config.disabled ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

          </div>
        )}

        {/* Panel: Events */}
        {activeTab === "events" && (
          <div className="flex gap-4 animate-[fade-in_0.2s_ease-out]" style={{ minHeight: 320 }}>

            {/* Sidebar: event list */}
            <div className="flex flex-col gap-1 w-44 flex-shrink-0">
              <button
                onClick={() => {
                  setEvents(ev => [{ id: uid(), type: "click", actions: [] }, ...ev]);
                  setActiveEvent(0);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-[#aaa] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-all mb-1 group"
              >
                <span className="w-4 h-4 rounded border border-[#e4e4e4] flex items-center justify-center group-hover:border-[#0f0f0f] transition-colors">
                  <Icon name="Plus" size={9} />
                </span>
                Событие
              </button>

              {events.map((event, i) => (
                <button
                  key={event.id}
                  onClick={() => setActiveEvent(i)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-left text-[13px] transition-all ${
                    activeEvent === i
                      ? "bg-[#0f0f0f] text-white"
                      : "text-[#555] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <span className="font-mono">{event.type}</span>
                  <div className="flex items-center gap-1.5">
                    {event.actions.length > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        activeEvent === i ? "bg-white/20 text-white" : "bg-[#f0f0f0] text-[#999]"
                      }`}>
                        {event.actions.length}
                      </span>
                    )}
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        const next = events.filter((_, idx) => idx !== i);
                        setEvents(next);
                        setActiveEvent(Math.min(activeEvent, next.length - 1));
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                        activeEvent === i ? "text-white/50 hover:text-white" : "text-[#ccc] hover:text-[#e53e3e]"
                      }`}
                    >
                      <Icon name="X" size={11} />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px bg-[#ebebeb] flex-shrink-0" />

            {/* Detail: selected event */}
            <div className="flex-1 min-w-0">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <p className="text-[#ccc] text-sm">Нет событий</p>
                  <p className="text-[#ddd] text-[12px] mt-1">Добавьте первое слева</p>
                </div>
              ) : events[activeEvent] ? (
                <div className="flex flex-col gap-4 animate-[fade-in_0.15s_ease-out]" key={events[activeEvent].id}>

                  {/* Event type selector */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Field label="Тип события">
                        <StyledSelect
                          value={events[activeEvent].type}
                          onChange={v => {
                            const list = [...events];
                            list[activeEvent] = { ...list[activeEvent], type: v as EventType };
                            setEvents(list);
                          }}
                          options={EVENT_TYPES}
                        />
                      </Field>
                    </div>
                    <div className="mt-5">
                      <MonoTag label={`${events[activeEvent].actions.length} действ.`} />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#bbb]">Действия</span>
                    <div className="flex-1 h-px bg-[#f0f0f0]" />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <AddBtn
                      onClick={() => {
                        const list = [...events];
                        list[activeEvent] = {
                          ...list[activeEvent],
                          actions: [
                            { id: uid(), type: "navigate", value: "", nestedActions: [] },
                            ...list[activeEvent].actions,
                          ],
                        };
                        setEvents(list);
                      }}
                      label="Добавить действие"
                    />
                    {events[activeEvent].actions.length === 0 && (
                      <p className="text-[12px] text-[#ccc] py-1">Нет действий</p>
                    )}
                    {events[activeEvent].actions.map((action, ai) => (
                      <ActionRow
                        key={action.id}
                        action={action}
                        onChange={updated => {
                          const list = [...events];
                          const actions = [...list[activeEvent].actions];
                          actions[ai] = updated;
                          list[activeEvent] = { ...list[activeEvent], actions };
                          setEvents(list);
                        }}
                        onRemove={() => {
                          const list = [...events];
                          list[activeEvent] = {
                            ...list[activeEvent],
                            actions: list[activeEvent].actions.filter((_, idx) => idx !== ai),
                          };
                          setEvents(list);
                        }}
                      />
                    ))}
                  </div>

                </div>
              ) : null}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}