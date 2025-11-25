import { useState } from 'react'
import { useValidarPromocion } from '../../hooks/usePromociones'
import './PromocionInput.css'

export default function PromocionInput({ onPromocionAplicada, totalCarrito }) {
  const [codigo, setCodigo] = useState('')
  const [promocionActual, setPromocionActual] = useState(null)
  const { mutate: validarCodigo, isPending, isError, error } = useValidarPromocion()

  const handleValidar = () => {
    if (!codigo.trim()) return

    validarCodigo(codigo.toUpperCase(), {
      onSuccess: (data) => {
        if (data.valido) {
          // Validar monto mínimo
          const total = parseFloat(totalCarrito)
          if (data.promocion.monto_minimo > 0 && total < data.promocion.monto_minimo) {
            alert(`Esta promoción requiere un monto mínimo de $${data.promocion.monto_minimo}`)
            return
          }
          
          setPromocionActual(data.promocion)
          onPromocionAplicada(data.promocion)
        }
      },
      onError: (err) => {
        console.error('Error al validar promoción:', err)
      }
    })
  }

  const handleRemover = () => {
    setPromocionActual(null)
    setCodigo('')
    onPromocionAplicada(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleValidar()
    }
  }

  return (
    <div className="promocion-input-container">
      <h3>💳 ¿Tienes un código de promoción?</h3>
      
      {!promocionActual ? (
        <>
          <div className="promocion-input-group">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Ej: BLACKFRIDAY2024"
              disabled={isPending}
              maxLength={50}
            />
            <button 
              onClick={handleValidar}
              disabled={isPending || !codigo.trim()}
              className="btn btn-primary"
            >
              {isPending ? 'Validando...' : 'Aplicar'}
            </button>
          </div>

          {isError && (
            <div className="error-message">
              <span>❌</span>
              {error?.response?.data?.mensaje || 'Código inválido o expirado'}
            </div>
          )}

          <div className="promociones-disponibles">
            <p className="hint-text">Códigos disponibles:</p>
            <div className="codigos-ejemplo">
              <span className="codigo-ejemplo">BLACKFRIDAY2024</span>
              <span className="codigo-ejemplo">NUEVO2024</span>
              <span className="codigo-ejemplo">AHORRA200</span>
            </div>
          </div>
        </>
      ) : (
        <div className="promocion-aplicada">
          <div className="promocion-aplicada-content">
            <div className="promocion-icon-success">🎉</div>
            <div className="promocion-info">
              <strong>{promocionActual.nombre}</strong>
              <p className="promocion-detalle">
                {promocionActual.tipo_descuento === 'porcentaje' 
                  ? `${promocionActual.valor_descuento}% de descuento`
                  : `$${promocionActual.valor_descuento} de descuento`}
              </p>
              <p className="promocion-codigo">Código: {promocionActual.codigo}</p>
            </div>
          </div>
          <button 
            onClick={handleRemover} 
            className="btn-remove"
            title="Remover promoción"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}