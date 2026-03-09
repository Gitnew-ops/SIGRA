// SIGRA - Formatação Angolana

export class AngolaFormatters {
  // Data: DD/MM/AAAA
  static formatDate(date: Date | string | number): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '--/--/----';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  // Hora: HH:MM:SS (24h)
  static formatTime(date: Date | string | number): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '--:--:--';
    
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  // Data e Hora: DD/MM/AAAA HH:MM:SS
  static formatDateTime(date: Date | string | number): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  // Moeda: Kz 1.000.000.000,00
  static formatCurrency(value: number, showSymbol: boolean = true): string {
    if (isNaN(value)) return showSymbol ? 'Kz 0,00' : '0,00';
    
    const absoluteValue = Math.abs(value);
    const fixedValue = absoluteValue.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedValue = `${formattedInteger},${decimalPart || '00'}`;
    const sign = value < 0 ? '-' : '';
    
    return showSymbol ? `${sign}Kz ${formattedValue}` : `${sign}${formattedValue}`;
  }

  // Números grandes simplificados
  static formatLargeNumber(value: number): string {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} biliões`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} milhões`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} mil`;
    }
    return value.toString();
  }

  // Formatar número com separadores
  static formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Percentual
  static formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Gerar referência de pagamento
  static generatePaymentReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MULT${timestamp.substring(timestamp.length - 6)}${random}`;
  }

  // Gerar matrícula angolana por província
  static generatePlate(province: string): string {
    const prefixes: Record<string, string> = {
      'Luanda': 'LA',
      'Huíla': 'HL',
      'Benguela': 'BG',
      'Huambo': 'HO',
      'Bié': 'BIE',
      'Cuanza Sul': 'CS',
      'Uíge': 'UGE',
      'Malanje': 'MAL',
      'Cabinda': 'CAB',
      'Zaire': 'ZAI',
      'Cunene': 'CUN',
      'Namibe': 'NAM',
      'Cuando Cubango': 'CC',
      'Moxico': 'MOX',
      'Lunda Sul': 'LS',
      'Lunda Norte': 'LN',
      'Bengo': 'BEN',
      'Cuanza Norte': 'CN'
    };
    
    const prefix = prefixes[province] || 'ANG';
    const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
    const numbers = Math.floor(Math.random() * 90) + 10;
    
    return `${prefix}-${letters}-${numbers}`;
  }
}

// Aliases para uso rápido
export const formatDate = AngolaFormatters.formatDate;
export const formatTime = AngolaFormatters.formatTime;
export const formatDateTime = AngolaFormatters.formatDateTime;
export const formatCurrency = AngolaFormatters.formatCurrency;
export const formatLargeNumber = AngolaFormatters.formatLargeNumber;
export const formatNumber = AngolaFormatters.formatNumber;
export const formatPercent = AngolaFormatters.formatPercent;
