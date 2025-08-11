import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DashboardCard from './DashboardCard';
import { Package, CheckCircle2, Clock3, BatteryCharging } from 'lucide-react';
import AddChipModal from './phone/AddChipModal';
import AddTelModal from './phone/AddTelModal';
import phoneService from '../services/phoneService';

const initialChips = [];
const initialTels = [];

const PhonePage = () => {
  const [activeList, setActiveList] = useState('chips'); // 'chips' | 'tels'
  const [chips, setChips] = useState(initialChips);
  const [tels, setTels] = useState(initialTels);
  const [isAddChipOpen, setIsAddChipOpen] = useState(false);
  const [isAddTelOpen, setIsAddTelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [chipsResp, telsResp] = await Promise.all([
          phoneService.getAllChips(),
          phoneService.getAllTelSystems(),
        ]);
        setChips(chipsResp || []);
        setTels(telsResp || []);
      } catch (e) {
        console.error('Erro ao carregar dados de telefone', e);
        setError('Erro ao carregar dados de telefone');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chipStats = useMemo(() => {
    const total = chips.length;
    const ativos = chips.filter((c) => c.status?.toLowerCase().startsWith('ativo')).length;
    const aguardando = chips.filter((c) => c.status === 'Aguardando Análise').length;
    const recarga = chips.filter((c) => c.status === 'Recarga Pendente').length;
    return { total, ativos, aguardando, recarga };
  }, [chips]);

  const addChip = async (chip) => {
    try {
      const created = await phoneService.createChip(chip);
      setChips((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Erro ao criar chip', e);
      setError(e?.response?.data?.error || 'Erro ao criar chip');
    }
  };

  const addTel = async (tel) => {
    try {
      const created = await phoneService.createTelSystem(tel);
      setTels((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Erro ao criar Tel Sistema', e);
      setError(e?.response?.data?.error || 'Erro ao criar Tel Sistema');
    }
  };

  return (
    <div className="space-y-8">
      {/* Switch de listas */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-md border border-border p-1 bg-muted/50">
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${activeList === 'chips' ? 'bg-background shadow-card' : 'text-muted-foreground'}`}
            onClick={() => setActiveList('chips')}
          >
            Chips
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${activeList === 'tels' ? 'bg-background shadow-card' : 'text-muted-foreground'}`}
            onClick={() => setActiveList('tels')}
          >
            Tel Sistemas
          </button>
        </div>

        {activeList === 'chips' ? (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsAddChipOpen(true)}>
            Adicionar Chip
          </Button>
        ) : (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsAddTelOpen(true)}>
            Adicionar Tel
          </Button>
        )}
      </div>

      {activeList === 'chips' && (
        <>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
            <DashboardCard title="Total de Chips" value={chipStats.total} icon={Package} color="primary" />
            <DashboardCard title="Chips Ativos" value={chipStats.ativos} icon={CheckCircle2} color="primary" />
            <DashboardCard title="Aguardando Análise" value={chipStats.aguardando} icon={Clock3} color="secondary" />
            <DashboardCard title="Recarga Pendente" value={chipStats.recarga} icon={BatteryCharging} color="warning" />
          </div>

          {/* Tabela de chips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-t-md">
                <div className="col-span-2 font-medium">IP</div>
                <div className="col-span-2 font-medium">Número</div>
                <div className="col-span-2 font-medium">Status</div>
                <div className="col-span-2 font-medium">Operadora</div>
                <div className="col-span-3 font-medium">Consultor</div>
                <div className="col-span-1 font-medium text-right">Ações</div>
              </div>

              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-6 text-muted-foreground">Carregando...</div>
                ) : chips.length > 0 ? (
                  chips.map((chip) => (
                    <div key={chip._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                      <div className="md:col-span-2">{chip.ip}</div>
                      <div className="md:col-span-2">{chip.number}</div>
                      <div className="md:col-span-2">
                        <span className="text-sm">{chip.status}</span>
                      </div>
                      <div className="md:col-span-2">{chip.carrier}</div>
                      <div className="md:col-span-3">{chip.consultant}</div>
                      <div className="md:col-span-1 flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">Nenhum chip cadastrado.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeList === 'tels' && (
        <>
          {/* Tabela de Tel Sistemas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tel Sistemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-t-md">
                <div className="col-span-4 font-medium">Número</div>
                <div className="col-span-4 font-medium">WhatsApp Business</div>
                <div className="col-span-3 font-medium">WhatsApp Pessoal</div>
                <div className="col-span-1 font-medium text-right">Ações</div>
              </div>

              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-6 text-muted-foreground">Carregando...</div>
                ) : tels.length > 0 ? (
                  tels.map((tel) => {
                    const isBusiness = tel.type === 'WhatsApp Business';
                    return (
                      <div key={tel._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                        <div className="md:col-span-4">{tel.number}</div>
                        <div className="md:col-span-4">{isBusiness ? tel.consultant : ''}</div>
                        <div className="md:col-span-3">{!isBusiness ? tel.consultant : ''}</div>
                        <div className="md:col-span-1 text-right"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground">Nenhum registro de Tel Sistemas.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modais */}
      <AddChipModal open={isAddChipOpen} onOpenChange={setIsAddChipOpen} onSave={addChip} />
      <AddTelModal open={isAddTelOpen} onOpenChange={setIsAddTelOpen} onSave={addTel} />
    </div>
  );
};

export default PhonePage;
