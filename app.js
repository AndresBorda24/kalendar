/**
 * Esta funcion es la "principal" genera el html y carga los eventos
*/
function generateCalendar(id) {
  try {
    if (!Boolean(Alpine)) throw new Error("No Alpine Detected");

    const $el = document.querySelector(id);
    if (!$el) throw new Error("Cannot find element");

    $el.innerHTML = getHTMLMarkUp();
  } catch (e) {
    console.error("Ha ocurrido un error generando el componente", e);
  }
}

/**
 * Genera el HTML del componente
*/
function getHTMLMarkUp() {
  return `
    <div
    x-data="kalendar"
    class="kalendar">
      <div class="k-head-control" style="padding: 5px">
        <div style="display: flex; gap: 5px">
          <button
          @click="previous"
          class="k-btn k-btn-move"><</button>
          <button
          @click="next"
          class="k-btn k-btn-move">></button>
        </div>
        <span style="font-size: 1.3rem;">
          <span x-text="MonthName"></span>
          <span x-text="Year"></span>
        </span>
      </div>
      <div class="k-grid k-grid-7 k-day-container">
        <template x-for="_ in _daynames">
          <div class="k-header-day k-x-day" x-text="_"></div>
        </template>
      </div>

      <div class="k-grid k-grid-7 k-day-container" style="border-top: 0px;">
        <template x-for="_ in blankSpaces">
          <div class="k-day k-blank-space"></div>
        </template>
        <template x-for="_ in totalSpaces">
          <div class="k-day k-x-day">
            <span class="k-day-number" x-text="_"></span>
          </div>
        </template>
        <template x-for="_ in blankSpacesBtm">
          <div class="k-day k-blank-space"></div>
        </template>
      </div>
    </div>
    `;
}

/**
 * Componenete  principal de alpine
*/
function kalendar() {
  return {
    mode: 1, // 1: Mes, 2: Semana
    /** Fecha que se emplea como Referencia para hacer los calculos*/
    ctrl: new Date(),
    /** Determina el numero de celdas vacias al principio de cada mes. */
    blankSpaces: 0,
    /**  Determina el numero de celdas vacias al final de cada mes. */
    blankSpacesBtm: 0,
    /**  El numero total de dias que tiene el mes. */
    totalSpaces: 0,

    __days: [],

    /** Day names */
    _daynames: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    _monthNames: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],

    init() {
      this.ctrl.setDate(1);
      this.setUp();
    },

    /**
     * Organiza la info necesaria teniendo en cuenta el valor de `ctrl`
    */
    setUp() {



      this.blankSpaces = this.ctrl.getDay() % 7;
      this.totalSpaces = new Date(
        this.Year, this.Month + 1, 0
      ).getDate();

      const _ = this.blankSpaces + this.totalSpaces;
      this.blankSpacesBtm = Math.ceil(_ / 7) * 7 - _;
    },

    /** Carga mes anterior */
    previous() {
      const m = this.Month;

      if (m == 0) {
        this.Month = 11;
        this.Year = this.Year - 1;
      } else {
        this.Month = m - 1;
      }
      this.setUp();
    },

    /** Carga siguiente mes */
    next() {
      const m = this.Month;

      if (m == 11) {
        this.Month = 0;
        this.Year = this.Year + 1;
      } else {
        this.Month = m + 1;
      }
      this.setUp();
    },

    /** Retorna el anio de ctrl */
    get Year() {
      return this.ctrl.getFullYear();
    },
    set Year(y) {
      this.ctrl.setFullYear( y );
    },

    /** Retorna el anio de ctrl */
    get Day() {
      return this.ctrl.getDate();
    },

    /** Retorna el mes de ctrl */
    get Month() {
      return this.ctrl.getMonth();
    },
    get MonthName() {
      return this._monthNames[ this.Month ];
    },
    set Month( m ) {
      this.ctrl.setMonth(m);
    }
  };
}

