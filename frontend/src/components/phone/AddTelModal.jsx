import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const defaultForm = {
  number: '',
  type: '',
  consultant: '',
};

const AddTelModal = ({ open, onOpenChange, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(defaultForm);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.number) e.number = 'Número é obrigatório';
    if (!form.type) e.type = 'Tipo é obrigatório';
    if (!form.consultant) e.consultant = 'Consultor é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave?.({ ...form });
    onOpenChange(false);
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background text-foreground p-6 shadow-lg border border-border focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-1">Adicionar Tel Sistema</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            Preencha os dados do Tel Sistema
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número *</label>
                <Input value={form.number} onChange={(e) => setField('number', e.target.value)} placeholder="(11) 9 9999-9999" />
                {errors.number && <p className="text-xs text-red-600 mt-1">{errors.number}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <Select value={form.type} onValueChange={(v) => setField('type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp Business">WhatsApp Business</SelectItem>
                    <SelectItem value="WhatsApp Pessoal">WhatsApp Pessoal</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Consultor *</label>
                <Input value={form.consultant} onChange={(e) => setField('consultant', e.target.value)} placeholder="Nome do consultor" />
                {errors.consultant && <p className="text-xs text-red-600 mt-1">{errors.consultant}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTelModal;
