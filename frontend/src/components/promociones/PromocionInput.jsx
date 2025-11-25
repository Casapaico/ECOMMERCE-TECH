import { useState } from 'react'
import { useValidarPromocion } from '../../hooks/usePromociones'
import './PromocionInput.css'

export default function PromocionInput({ onPromocionAplicada }) {
  const [codigo, setCodigo] = useState('')
  const [promocionActual, setPromocionActual] = useState(null)
  const { mutate: validarCodigo, isPending, isError, error } = useValidarPromocion()

  const handleValidar = () => {
    if (!codigo.trim()) return

    validarCodigo(codigo.toUpperCase(), {
      onSuccess: (data) => {
        if (data.valido) {
          setPromocionActual(data.promocion)
          onPromocionAplicada(data.promocion)
        }
      },
    })
  }

  const handleRemover = () => {
    setPromocionActual(null)
    setCodigo('')
    onPromocionAplicada(null)
  }

  return (
    <div className="promocion-input-container">
      <h3>¿Tienes un código de promoción?</h3>
      
      {!promocionActual ? (
        <div className="promocion-input-group">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código"
            disabled={isPending}
          />
          <button 
            onClick={handleValidar}
            disabled={isPending || !codigo.trim()}
            className="btn btn-primary"
          >
            {isPending ? 'Validando...' : 'Aplicar'}
          </button>
        </div>
      ) : (
        <div className="promocion-aplicada">
          <div className="promocion-info">
            <span className="promocion-icon">🎉</span>
            <div>
              <strong>{promocionActual.nombre}</strong>
              <p>
                {promocionActual.tipo_descuento === 'porcentaje' 
                  ? `${promocionActual.valor_descuento}% de descuento`
                  : `$${promocionActual.valor_descuento} de descuento`}
              </p>
            </div>
          </div>
          <button onClick={handleRemover} className="btn-remove">
            ✕
          </button>
        </div>
      )}

      {isError && (
        <p className="error-message">
          {error?.response?.data?.mensaje || 'Código inválido'}
        </p>
      )}
    </div>
  )
}