"use client"

import { Card } from "@/components/Card"
import { Button } from "@/components/ui/button"
import { cx } from "@/lib/utils"
import { SimulationStats } from "@/types/simulation"
import { RiAddLine, RiDownloadLine, RiSaveLine } from "@remixicon/react"
import { useState } from "react"

interface Scenario {
  id: string
  name: string
  description: string
  stats: SimulationStats
  createdAt: Date
}

interface ScenarioManagerProps {
  currentStats: SimulationStats
  onLoadScenario: (stats: SimulationStats) => void
  onScenariosSelect: (
    scenarios: Array<{
      id: string
      name: string
      stats: SimulationStats
    }>,
  ) => void
}

export function ScenarioManager({
  currentStats,
  onLoadScenario,
  onScenariosSelect,
}: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newScenarioName, setNewScenarioName] = useState("")
  const [newScenarioDescription, setNewScenarioDescription] = useState("")

  const handleSaveScenario = () => {
    const newScenario: Scenario = {
      id: crypto.randomUUID(),
      name: newScenarioName,
      description: newScenarioDescription,
      stats: currentStats,
      createdAt: new Date(),
    }
    setScenarios([...scenarios, newScenario])
    setShowSaveDialog(false)
    setNewScenarioName("")
    setNewScenarioDescription("")
  }

  const handleExportComparison = () => {
    const selectedData = scenarios.filter((s) =>
      selectedScenarios.includes(s.id),
    )
    // TODO: Implement export logic
  }

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarios((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]

      // Update parent component with selected scenarios
      const selectedData = scenarios
        .filter((s) => newSelection.includes(s.id))
        .map(({ id, name, stats }) => ({ id, name, stats }))
      onScenariosSelect(selectedData)

      return newSelection
    })
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Scenarioer
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Lagre og sammenlign ulike investeringsscenarioer
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2"
            >
              <RiSaveLine className="size-4" />
              Lagre scenario
            </Button>
            <Button
              variant="outline"
              onClick={handleExportComparison}
              disabled={selectedScenarios.length === 0}
              className="flex items-center gap-2"
            >
              <RiDownloadLine className="size-4" />
              Eksporter sammenligning
            </Button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="rounded-lg border border-warm-grey-2/20 bg-warm-white/50 p-4 dark:border-warm-grey-1/20 dark:bg-warm-grey/30">
            <h4 className="text-sm font-medium text-warm-grey dark:text-warm-white">
              Lagre nytt scenario
            </h4>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Navn
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
                />
              </div>
              <div>
                <label className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Beskrivelse
                </label>
                <textarea
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleSaveScenario}
                  disabled={!newScenarioName}
                >
                  Lagre
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios List */}
        <div className="space-y-4">
          {scenarios.length === 0 ? (
            <div className="rounded-lg border border-dashed border-warm-grey-2/20 p-8 text-center dark:border-warm-grey-1/20">
              <RiAddLine className="mx-auto size-8 text-warm-grey-2 dark:text-warm-grey-1" />
              <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Ingen scenarioer lagret ennå.
                <br />
                Klikk på &quot;Lagre scenario&quot; for å komme i gang.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={cx(
                    "rounded-lg border p-4 transition-colors",
                    selectedScenarios.includes(scenario.id)
                      ? "border-light-blue bg-light-blue/5 dark:border-light-blue dark:bg-light-blue/10"
                      : "border-warm-grey-2/20 bg-warm-white/50 dark:border-warm-grey-1/20 dark:bg-warm-grey/30",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={() => toggleScenarioSelection(scenario.id)}
                          className="size-4 rounded border-warm-grey-2/20 bg-warm-white text-light-blue focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey"
                        />
                        <div>
                          <h4 className="font-medium text-warm-grey dark:text-warm-white">
                            {scenario.name}
                          </h4>
                          <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                            {scenario.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div>
                          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                            Kjøpspris
                          </p>
                          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
                            {new Intl.NumberFormat("no").format(
                              scenario.stats.purchasePrice,
                            )}{" "}
                            NOK
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                            Yield
                          </p>
                          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
                            {scenario.stats.exitYield}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                            Leieinntekter
                          </p>
                          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
                            {new Intl.NumberFormat("no").format(
                              scenario.stats.rentalIncome,
                            )}{" "}
                            NOK
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onLoadScenario(scenario.stats)}
                    >
                      Last inn
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
