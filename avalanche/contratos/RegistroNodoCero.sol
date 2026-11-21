// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RegistroNodoCero
/// @notice Un registro público de proyectos. Cada vez que alguien registra el suyo, el contrato
///         emite el evento ProyectoRegistrado, que cualquiera puede leer desde n8n con eth_getLogs
///         (workflow 16-fuji-eventos-contrato), sin claves y sin cuenta.
/// @dev Contrato de ejemplo para aprender en la red de prueba Fuji: no recibe AVAX, no tiene dueña
///      y no guarda los textos en su almacenamiento. Los datos quedan en los eventos, que son más
///      baratos y son justo lo que lee el workflow.
contract RegistroNodoCero {
    /// @notice Se emite cada vez que se registra un proyecto.
    /// @param autora Quien firmó la transacción (msg.sender). Es «indexed»: viaja en topics[1] y
    ///               se puede filtrar por ella al pedir los eventos.
    /// @param nombre El nombre del proyecto. Los parámetros que no son «indexed» viajan juntos en
    ///               el campo «data» del evento, codificados con la ABI.
    /// @param enlace Un enlace al repo, a un video o a la página del proyecto. Puede ir vacío.
    /// @param cuando La hora del bloque en segundos desde el 1 de enero de 1970 (hora Unix).
    ///
    /// La firma del evento es «ProyectoRegistrado(address,string,string,uint256)» y su topic0, el
    /// keccak256 de esa firma, es:
    /// 0xa349a1d38906b94dcd1cbd81cc94738a389a4deaf16ae3d301bc1617cc04df77 (mirá el README).
    event ProyectoRegistrado(address indexed autora, string nombre, string enlace, uint256 cuando);

    /// @notice Largo máximo de cada texto, en bytes. Una letra con tilde ocupa 2 bytes.
    ///         Los límites evitan que alguien llene el registro con textos enormes.
    uint256 public constant LARGO_MAXIMO_NOMBRE = 100;
    uint256 public constant LARGO_MAXIMO_ENLACE = 200;

    /// @notice Cuántos proyectos se registraron hasta ahora. Al ser «public», Solidity crea una
    ///         función de lectura con el mismo nombre: totalProyectos().
    uint256 public totalProyectos;

    /// @notice Registrá tu proyecto. Es una transacción: la firmás con Core Wallet y cuesta un poco
    ///         de gas, que en Fuji se paga con AVAX de prueba.
    /// @param nombre El nombre del proyecto (obligatorio).
    /// @param enlace Un enlace para conocerlo (opcional: mandá "" si no tenés).
    function registrar(string calldata nombre, string calldata enlace) external {
        uint256 largoNombre = bytes(nombre).length;
        // Si una condición no se cumple, la transacción se revierte y no se registra nada.
        require(largoNombre > 0, "Falta el nombre");
        require(largoNombre <= LARGO_MAXIMO_NOMBRE, "El nombre es muy largo");
        require(bytes(enlace).length <= LARGO_MAXIMO_ENLACE, "El enlace es muy largo");

        totalProyectos += 1;

        // El evento queda guardado en el recibo de la transacción, para siempre.
        emit ProyectoRegistrado(msg.sender, nombre, enlace, block.timestamp);
    }
}
