"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type ComplexityKey = "simple" | "medium" | "hard"
type UrgencyKey = "none" | "urgent" | "very_urgent"
type ServiceKey =
	| "static"
	| "adaptation"
	| "resize"
	| "neuro_video"
	| "motion"
	| "editing"
	| "subtitles"
	| "voiceover"
	| "slide"
	| "complex_slide"
	| "slide_animation"
	| "builder_base"
	| "builder_section_simple"
	| "builder_section_complex"
	| "builder_page"
	| "custom_base"
	| "custom_section"
	| "custom_page"
	| "ui_component"
	| "form"
	| "slider"
	| "gallery"
	| "cards"
	| "faq"
	| "table"
	| "quiz"
	| "section_animation"
	| "element_animation"
	| "parallax"
	| "telegram_email"
	| "crm"
	| "payments"
	| "analytics"
	| "bot_base"
	| "bot_commands"
	| "bot_db"
	| "bot_admin"
	| "bot_api"
	| "bot_payments"
	| "bot_miniapp"
	| "concept"
	| "research"
	| "deploy"
	| "small_edit"
	| "big_edit"

type Service = {
	key: ServiceKey
	label: string
	category: string
	unit: string
	price: number
}

type CalculationRow = {
	id: string
	service: ServiceKey
	qty: number
}

const SERVICES: Service[] = [
	{ key: "static", label: "Статичный креатив", category: "Графика", unit: "шт", price: 20 },
	{ key: "adaptation", label: "Адаптация креатива", category: "Графика", unit: "шт", price: 10 },
	{ key: "resize", label: "Ресайз баннера", category: "Графика", unit: "шт", price: 10 },

	{ key: "neuro_video", label: "Нейро-видео", category: "Видео", unit: "шт", price: 20 },
	{ key: "motion", label: "Моушен графика", category: "Видео", unit: "сек", price: 3 },
	{ key: "editing", label: "Монтаж", category: "Видео", unit: "сек", price: 5 },
	{ key: "subtitles", label: "Субтитры", category: "Видео", unit: "сек", price: 2 },
	{ key: "voiceover", label: "Озвучка (AI voiceover)", category: "Видео", unit: "мин", price: 5 },

	{ key: "slide", label: "Слайд", category: "Презентации", unit: "шт", price: 15 },
	{ key: "complex_slide", label: "Сложный слайд", category: "Презентации", unit: "шт", price: 25 },
	{ key: "slide_animation", label: "Анимация слайда", category: "Презентации", unit: "шт", price: 5 },

	{ key: "builder_base", label: "База проекта (конструктор)", category: "Сайты на конструкторе", unit: "шт", price: 300 },
	{ key: "builder_section_simple", label: "Секция простая (конструктор)", category: "Сайты на конструкторе", unit: "шт", price: 30 },
	{ key: "builder_section_complex", label: "Секция сложная (конструктор)", category: "Сайты на конструкторе", unit: "шт", price: 50 },
	{ key: "builder_page", label: "Доп. страница (конструктор)", category: "Сайты на конструкторе", unit: "шт", price: 200 },

	{ key: "custom_base", label: "База проекта (самописный)", category: "Самописные сайты", unit: "шт", price: 600 },
	{ key: "custom_section", label: "Секция (самописный)", category: "Самописные сайты", unit: "шт", price: 50 },
	{ key: "custom_page", label: "Доп. страница (самописный)", category: "Самописные сайты", unit: "шт", price: 300 },
	{ key: "ui_component", label: "UI компонент", category: "Самописные сайты", unit: "шт", price: 50 },

	{ key: "form", label: "Форма", category: "Компоненты сайта", unit: "шт", price: 50 },
	{ key: "slider", label: "Слайдер", category: "Компоненты сайта", unit: "шт", price: 50 },
	{ key: "gallery", label: "Галерея", category: "Компоненты сайта", unit: "шт", price: 40 },
	{ key: "cards", label: "Карточки", category: "Компоненты сайта", unit: "шт", price: 40 },
	{ key: "faq", label: "FAQ / аккордеон", category: "Компоненты сайта", unit: "шт", price: 30 },
	{ key: "table", label: "Таблица", category: "Компоненты сайта", unit: "шт", price: 30 },
	{ key: "quiz", label: "Калькулятор / квиз", category: "Компоненты сайта", unit: "шт", price: 100 },

	{ key: "section_animation", label: "Анимация секции", category: "Анимации сайта", unit: "шт", price: 40 },
	{ key: "element_animation", label: "Анимация элементов", category: "Анимации сайта", unit: "шт", price: 30 },
	{ key: "parallax", label: "Параллакс / эффекты", category: "Анимации сайта", unit: "шт", price: 60 },

	{ key: "telegram_email", label: "Форма → Telegram / email", category: "Интеграции", unit: "шт", price: 50 },
	{ key: "crm", label: "CRM интеграция", category: "Интеграции", unit: "шт", price: 150 },
	{ key: "payments", label: "Платежи", category: "Интеграции", unit: "шт", price: 200 },
	{ key: "analytics", label: "Аналитика / пиксели", category: "Интеграции", unit: "шт", price: 50 },

	{ key: "bot_base", label: "База бота", category: "Telegram боты", unit: "шт", price: 200 },
	{ key: "bot_commands", label: "Команды / меню", category: "Telegram боты", unit: "шт", price: 50 },
	{ key: "bot_db", label: "База данных", category: "Telegram боты", unit: "шт", price: 150 },
	{ key: "bot_admin", label: "Админка", category: "Telegram боты", unit: "шт", price: 150 },
	{ key: "bot_api", label: "API интеграция", category: "Telegram боты", unit: "шт", price: 200 },
	{ key: "bot_payments", label: "Платежи для бота", category: "Telegram боты", unit: "шт", price: 200 },
	{ key: "bot_miniapp", label: "Mini app", category: "Telegram боты", unit: "шт", price: 300 },

	{ key: "concept", label: "Концепция / сценарий", category: "Доп. работы", unit: "шт", price: 100 },
	{ key: "research", label: "Ресёрч", category: "Доп. работы", unit: "шт", price: 50 },
	{ key: "deploy", label: "Настройка домена / деплой", category: "Доп. работы", unit: "шт", price: 50 },

	{ key: "small_edit", label: "Маленькая правка", category: "Правки", unit: "шт", price: 20 },
	{ key: "big_edit", label: "Большая правка", category: "Правки", unit: "шт", price: 50 },
]

const COMPLEXITY: Record<ComplexityKey, { label: string; value: number }> = {
	simple: { label: "Простая", value: 1 },
	medium: { label: "Средняя", value: 1.25 },
	hard: { label: "Сложная", value: 1.5 },
}

const URGENCY: Record<UrgencyKey, { label: string; value: number }> = {
	none: { label: "Без срочности", value: 1 },
	urgent: { label: "Срочно", value: 1.5 },
	very_urgent: { label: "Очень срочно", value: 2 },
}

const groupedServices = SERVICES.reduce<Record<string, Service[]>>((acc, service) => {
	if (!acc[service.category]) {
		acc[service.category] = []
	}

	acc[service.category].push(service)
	return acc
}, {})

function getServiceByKey(key: ServiceKey): Service {
	return SERVICES.find((service) => service.key === key) ?? SERVICES[0]
}

function formatMoney(value: number): string {
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	}).format(value)
}

function formatMultiplier(value: number): string {
	return `×${value}`
}

function getQtyLabel(unit: string): string {
	if (unit === "сек") {
		return "Секунды"
	}

	if (unit === "мин") {
		return "Минуты"
	}

	return "Количество"
}

function getQtyStep(unit: string): string {
	if (unit === "мин") {
		return "0.1"
	}

	return "1"
}

export default function PriceCalculatorPage() {
	const [rows, setRows] = useState<CalculationRow[]>([
		{ id: crypto.randomUUID(), service: "static", qty: 1 },
	])
	const [complexity, setComplexity] = useState<ComplexityKey>("simple")
	const [urgency, setUrgency] = useState<UrgencyKey>("none")
	const [isDesignerWork, setIsDesignerWork] = useState<boolean>(false)
	const [minimumCheck, setMinimumCheck] = useState<number>(0)

	const baseSubtotal = useMemo(() => {
		return rows.reduce((sum, row) => {
			const service = getServiceByKey(row.service)
			return sum + service.price * row.qty
		}, 0)
	}, [rows])

	const calculated = useMemo(() => {
		const complexityValue = COMPLEXITY[complexity].value
		const urgencyValue = URGENCY[urgency].value

		const afterComplexity = baseSubtotal * complexityValue
		const afterUrgency = afterComplexity * urgencyValue
		const total = Math.max(afterUrgency, minimumCheck || 0)

		const yourIncome = isDesignerWork ? total * 0.6 : total
		const designerIncome = isDesignerWork ? total * 0.4 : 0

		return {
			afterComplexity,
			afterUrgency,
			total,
			yourIncome,
			designerIncome,
		}
	}, [baseSubtotal, complexity, urgency, minimumCheck, isDesignerWork])

	function updateRow(id: string, patch: Partial<CalculationRow>) {
		setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
	}

	function addRow() {
		setRows((prev) => [...prev, { id: crypto.randomUUID(), service: "static", qty: 1 }])
	}

	function removeRow(id: string) {
		setRows((prev) => {
			if (prev.length === 1) {
				return prev
			}

			return prev.filter((row) => row.id !== id)
		})
	}

	function clearAll() {
		setRows([{ id: crypto.randomUUID(), service: "static", qty: 1 }])
		setComplexity("simple")
		setUrgency("none")
		setIsDesignerWork(false)
		setMinimumCheck(0)
	}

	return (
		<div className="min-h-screen bg-muted/30 p-4 md:p-8">
			<div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_420px]">
				<Card className="rounded-2xl shadow-sm">
					<CardHeader>
						<CardTitle className="text-2xl">Калькулятор прайса</CardTitle>
						<CardDescription>
							Выбирай услуги, указывай объём и сразу получай сумму по своему прайсу.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							{rows.map((row, index) => {
								const service = getServiceByKey(row.service)

								return (
									<Card key={row.id} className="rounded-2xl border bg-background">
										<CardContent className="grid gap-4 p-4 md:grid-cols-[1.5fr_120px_120px_auto] md:items-end">
											<div className="space-y-2">
												<Label>Услуга #{index + 1}</Label>
												<Select value={row.service} onValueChange={(value) => updateRow(row.id, { service: value as ServiceKey })}>
													<SelectTrigger className="rounded-xl">
														<SelectValue placeholder="Выбери услугу" />
													</SelectTrigger>
													<SelectContent className="max-h-[420px]">
														{Object.entries(groupedServices).map(([category, categoryServices]) => (
															<div key={category} className="pb-2">
																<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
																	{category}
																</div>
																{categoryServices.map((item) => (
																	<SelectItem key={item.key} value={item.key}>
																		{item.label} — {formatMoney(item.price)} / {item.unit}
																	</SelectItem>
																))}
															</div>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label>{getQtyLabel(service.unit)}</Label>
												<Input
													className="rounded-xl"
													type="number"
													min="0"
													step={getQtyStep(service.unit)}
													value={Number.isNaN(row.qty) ? "" : row.qty}
													onChange={(event) => updateRow(row.id, { qty: Number(event.target.value) || 0 })}
												/>
											</div>

											<div className="space-y-2">
												<Label>Ставка</Label>
												<div className="flex h-10 items-center rounded-xl border px-3 text-sm">
													{formatMoney(service.price)} / {service.unit}
												</div>
											</div>

											<div className="flex items-end justify-between gap-3 md:justify-end">
												<div className="space-y-1 text-right">
													<div className="text-xs text-muted-foreground">Сумма</div>
													<div className="font-medium">{formatMoney(service.price * row.qty)}</div>
												</div>
												<button
													type="button"
													onClick={() => removeRow(row.id)}
													className="rounded-xl border px-3 py-2 text-sm transition hover:bg-muted"
												>
													Удалить
												</button>
											</div>
										</CardContent>
									</Card>
								)
							})}
						</div>

						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								onClick={addRow}
								className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
							>
								Добавить услугу
							</button>
							<button
								type="button"
								onClick={clearAll}
								className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
							>
								Сбросить всё
							</button>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6">
					<Card className="rounded-2xl shadow-sm">
						<CardHeader>
							<CardTitle>Параметры</CardTitle>
							<CardDescription>Коэффициенты и дополнительные настройки расчёта.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="space-y-2">
								<Label>Сложность</Label>
								<Select value={complexity} onValueChange={(value) => setComplexity(value as ComplexityKey)}>
									<SelectTrigger className="rounded-xl">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(COMPLEXITY).map(([key, item]) => (
											<SelectItem key={key} value={key}>
												{item.label} — {formatMultiplier(item.value)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Срочность</Label>
								<Select value={urgency} onValueChange={(value) => setUrgency(value as UrgencyKey)}>
									<SelectTrigger className="rounded-xl">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(URGENCY).map(([key, item]) => (
											<SelectItem key={key} value={key}>
												{item.label} — {formatMultiplier(item.value)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3 rounded-xl border p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="space-y-1">
										<div className="text-sm font-medium">Исполняет дизайнер</div>
										<div className="text-sm text-muted-foreground">
											Ты получаешь 60%, дизайнер — 40%
										</div>
									</div>
									<Switch checked={isDesignerWork} onCheckedChange={setIsDesignerWork} />
								</div>
							</div>

							<div className="space-y-2">
								<Label>Минимальный чек</Label>
								<Input
									className="rounded-xl"
									type="number"
									min="0"
									step="1"
									value={minimumCheck}
									onChange={(event) => setMinimumCheck(Number(event.target.value) || 0)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="sticky top-8 rounded-2xl shadow-sm">
						<CardHeader>
							<CardTitle>Итог</CardTitle>
							<CardDescription>Разбивка расчёта по шагам.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Базовая сумма</span>
								<span>{formatMoney(baseSubtotal)}</span>
							</div>

							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">После сложности</span>
								<span>{formatMoney(calculated.afterComplexity)}</span>
							</div>

							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">После срочности</span>
								<span>{formatMoney(calculated.afterUrgency)}</span>
							</div>

							{minimumCheck > 0 ? (
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Минимальный чек</span>
									<span>{formatMoney(minimumCheck)}</span>
								</div>
							) : null}

							<Separator />

							<div className="space-y-2">
								<div className="text-sm text-muted-foreground">Цена для клиента</div>
								<div className="text-3xl font-semibold tracking-tight">{formatMoney(calculated.total)}</div>

								<div className="flex flex-wrap gap-2 pt-1">
									<Badge variant="secondary">{COMPLEXITY[complexity].label}</Badge>
									<Badge variant="secondary">{URGENCY[urgency].label}</Badge>
									{isDesignerWork ? <Badge>Делает дизайнер</Badge> : <Badge variant="outline">Делаю сам</Badge>}
								</div>
							</div>

							{isDesignerWork ? (
								<>
									<Separator />
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Твоя часть</span>
										<span>{formatMoney(calculated.yourIncome)}</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Дизайнеру</span>
										<span>{formatMoney(calculated.designerIncome)}</span>
									</div>
								</>
							) : null}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}