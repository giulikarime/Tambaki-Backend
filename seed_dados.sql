--
-- PostgreSQL database dump
--


-- Dumped from database version 18.7
-- Dumped by pg_dump version 18.7

TRUNCATE TABLE 
  "public"."StoreUnit", 
  "public"."Supplier", 
  "public"."Tag", 
  "public"."Menu", 
  "public"."Notification" 
RESTART IDENTITY CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: StoreUnit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."StoreUnit" VALUES (1, 'Doce Sabor LTDA', 'Sabor & Cia', '12345678000199', 'Rua das Flores, 123, Centro', 'docesabor@email.com', '11987654321', '2026-11-17 16:24:21.37', '2026-11-17 16:24:21.37');


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Supplier" VALUES (1, 'Peixe Nobre LTDA', 'Peixe Nobre', '12345678900', '11988887777', 'contato@peixenobre.com', 'Av. Amazonas, 500', '{Carnes_e_Pescados}', NULL, 'Roberto Santos', 'de_1_a_3_Dias');
INSERT INTO public."Supplier" VALUES (2, 'Mercado Santa Luzia LTDA', 'Mercado Santa Luzia', '12345678000195', '11987654321', 'pedidos@mercadosantaluzia.com.br', 'Ceagesp - Av. Dr. Gastão Vidigal, 1946, Pavilhão M-10, Vila Leopoldina - São Paulo / SP', '{Carnes_e_Pescados}', NULL, 'Michael Jaylison', 'de_4_a_6_Dias');
INSERT INTO public."Supplier" VALUES (3, 'Distribuidora de Bebidas Vale do Sol S.A.', 'Vale do Sol Bebidas', '98765432000110', '1133445566', 'vendas@valedosolbebidas.com.br', 'Av. Imperatriz Leopoldina, 800, Vila Leopoldina - São Paulo / SP', '{Laticínios_e_Frios}', NULL, 'Stefanni Germanota', 'de_7_a_10_Dias');


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Product" VALUES (1, 'Açúcar Refinado', 12.5, 'Secos', 'Doce Sabor', '{Soja}', 50, 1, 'kg', 'kg', 'https://example.com/produto-acucar.pdf', 10, 100, '2026-01-10', '2027-01-10', 'Despensa_Estoque_Seco', 'Ativo', 'BATCH-001', '2026-11-17 16:24:21.689', '2026-11-17 16:24:21.689', 1, 1, 25);


--
-- Data for Name: Cost; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Cost" ("id", "costCategory", "costType", "amount", "date", "productId", "updateAt") VALUES 
(1, 'Aluguel', 'Fixo', 2000, '2026-11-04', 1, '2026-11-17 16:24:21.693'),
(2, 'Taxas_Maquininhas_Cartão', 'Variavel', 550, '2026-11-09', 1, '2026-11-17 16:24:21.693'),
(3, 'Embalagens', 'Variavel', 220, '2026-11-15', 1, '2026-11-17 16:24:21.693'),
(4, 'Salários_Equipe', 'Fixo', 7000, '2026-10-09', 1, '2026-11-17 16:24:21.693');


--
-- Data for Name: Menu; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Movement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Table; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Table" VALUES (1, 1, 4, 'Livre', '2026-11-17 16:24:21.487', '2026-11-17 16:24:21.487', 1);
INSERT INTO public."Table" VALUES (2, 2, 2, 'Livre', '2026-11-17 16:24:21.487', '2026-11-17 16:24:21.487', 1);
INSERT INTO public."Table" VALUES (3, 3, 6, 'Ocupado', '2026-11-17 16:24:21.487', '2026-11-17 16:24:21.487', 1);
INSERT INTO public."Table" VALUES (4, 4, 5, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (5, 6, 4, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (6, 9, 6, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (7, 10, 8, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (8, 5, 6, 'Reservado', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (9, 8, 4, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);
INSERT INTO public."Table" VALUES (10, 7, 2, 'Livre', '2026-11-17 16:24:21.488', '2026-11-17 16:24:21.488', 1);


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Reservation" VALUES (1, 'Larissa Manoela', '11987654321', 4, '2026-11-20', '19:00:00', '2026-11-20', '21:00:00', 'Pendente', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 1, 1);
INSERT INTO public."Reservation" VALUES (2, 'João Guilherme', '21976543210', 2, '2026-11-21', '20:30:00', '2026-11-21', '22:30:00', 'Confirmada', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 2, 1);
INSERT INTO public."Reservation" VALUES (3, 'Mariana Costa', '11912345678', 6, '2026-11-22', '19:00:00', '2026-11-22', '21:00:00', 'Confirmada', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 3, 1);
INSERT INTO public."Reservation" VALUES (4, 'Rafael Oliveira', '21912345678', 5, '2026-11-23', '19:30:00', '2026-11-23', '21:30:00', 'Pendente', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 4, 1);
INSERT INTO public."Reservation" VALUES (5, 'Camila Santos', '11923456789', 6, '2026-11-24', '20:00:00', '2026-11-24', '22:00:00', 'Confirmada', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 8, 1);
INSERT INTO public."Reservation" VALUES (6, 'Pedro Almeida', '31923456789', 4, '2026-11-25', '19:00:00', '2026-11-25', '21:00:00', 'Pendente', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 5, 1);
INSERT INTO public."Reservation" VALUES (7, 'Beatriz Lima', '11934567890', 2, '2026-11-26', '20:00:00', '2026-11-26', '22:00:00', 'Confirmada', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 10, 1);
INSERT INTO public."Reservation" VALUES (8, 'Lucas Ferreira', '21934567890', 4, '2026-11-27', '19:30:00', '2026-11-27', '21:30:00', 'Cancelada', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 9, 1);
INSERT INTO public."Reservation" VALUES (9, 'Isabela Rocha', '11945678901', 6, '2026-11-28', '19:00:00', '2026-11-28', '21:00:00', 'Concluida', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 6, 1);
INSERT INTO public."Reservation" VALUES (10, 'Gabriel Martins', '31945678901', 8, '2026-11-29', '20:00:00', '2026-11-29', '22:00:00', 'Pendente', '2026-11-17 16:24:21.668', '2026-11-17 16:24:21.668', 7, 1);


--
-- Data for Name: SupplierProducts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (1, 'Carlos Silva', '12345678901', 'carlos.gerente@saborecia.com', '11911112222', '$2b$10$kwq.y.88m61ewkH2Cw1QbulYsbtBDCbZMy2i9RciwTiOfG/XlJ/Sq', 'Gerente Geral', 'Master', 'CLT', 'Full_Time', '2023-01-15', 44, 4500, 'Banco do Brasil', true, 1, NULL);
INSERT INTO public."User" VALUES (2, 'Ana Souza', '98765432100', 'ana.souza@saborecia.com', '11933334444', '$2b$10$/i9wyrQumFGefs3S2C./Oe8TmuUZlka4GGKXLFb7scLTyVYEdjvpy', 'Atendente', 'Junior', 'CLT', 'Noite', '2023-06-01', 36, 2100, 'Nubank', true, 1, NULL);


--
-- Data for Name: _CostToMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _MenuToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _MovementToOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('086c13f3-2ba7-4efa-ad4f-158d3496fc98', 'c051afb3acc7e0b1bf819029e3e94dcb3758192015a11656dfa993dc3d788ebf', '2026-11-17 13:23:42.307589-03', '20261106193937', NULL, NULL, '2026-11-17 13:23:42.22768-03', 1);
INSERT INTO public._prisma_migrations VALUES ('42606597-f4cd-41a2-9af3-e39848ff00f2', 'abc8b711d6ad5c4a9663d0a85f48c00dd81bea655fddccaefbe0ec0e4024bce9', '2026-11-17 13:23:42.318213-03', '20261112171510', NULL, NULL, '2026-11-17 13:23:42.30793-03', 1);
INSERT INTO public._prisma_migrations VALUES ('2a1adb02-49b2-4780-ba8e-e2ba50fea739', 'ed3305c8985a1254d72a0eceb3b9f7930274c84c869857ed9ab62dfd2f600a1d', '2026-11-17 13:23:42.328673-03', '20261112205302', NULL, NULL, '2026-11-17 13:23:42.318584-03', 1);


--
-- Name: Client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Client_id_seq"', 1, false);


--
-- Name: Cost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cost_id_seq"', 4, true);


--
-- Name: Menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Menu_id_seq"', 1, false);


--
-- Name: Movement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Movement_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, false);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, false);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 1, true);


--
-- Name: Reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reservation_id_seq"', 10, true);


--
-- Name: StoreUnit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StoreUnit_id_seq"', 1, true);


--
-- Name: SupplierProducts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SupplierProducts_id_seq"', 1, false);


--
-- Name: Supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Supplier_id_seq"', 3, true);


--
-- Name: Table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Table_id_seq"', 10, true);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--