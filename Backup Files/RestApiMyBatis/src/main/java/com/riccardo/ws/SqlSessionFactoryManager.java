package com.riccardo.ws;

import java.io.IOException;
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SqlSessionFactoryManager { // classe che si occupa di gestire la connessione al db

	private static final Logger logger = LoggerFactory.getLogger(SqlSessionFactoryManager.class);

	private static SqlSessionFactory sqlSessionFactory;

	private SqlSessionFactoryManager() { // cotruttore privato
	}

	public static SqlSessionFactory getSqlSessionFactory() { // metodo per ottenere la connessione con il db
		if (sqlSessionFactory == null) {
			synchronized (SqlSessionFactoryManager.class) { // fa si che un solo thread alla volta possa
															// accedere(semaforo), controllo ulteriore lo metto per
															// sicurezza?
				if (sqlSessionFactory == null) {
					String resource = "configuration.xml";
					InputStream inputStream = null;
					try {
						inputStream = Resources.getResourceAsStream(resource);
						sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

					} catch (IOException e) {
						logger.error(e.getMessage(), e);
						throw new MotoException(e);
					} finally {
						try {
							inputStream.close();
						} catch (IOException e) {
							logger.error(e.getMessage(), e);
							throw new MotoException(e);
						}
					}
				}
			}
		}
		return sqlSessionFactory;
	}
}

/*
 * `SqlSessionFactoryManager` singleton in MyBatis:
 * 
 * 1. `SqlSessionFactoryManager` è una classe che gestisce la creazione e il
 * mantenimento di un'istanza singleton di `SqlSessionFactory`, che rappresenta
 * la connessione alla base di dati in MyBatis.
 * 
 * 2. La classe ha un costruttore privato per evitare che venga creata
 * un'istanza esterna.
 * 
 * 3. `getSqlSessionFactory()` è un metodo statico che restituisce l'istanza di
 * `SqlSessionFactory`. È il punto di accesso principale per ottenere la
 * connessione alla base di dati tramite MyBatis.
 * 
 * 4. All'interno del metodo `getSqlSessionFactory()`, viene utilizzata una
 * doppia verifica per garantire che solo la prima chiamata al metodo crei
 * effettivamente un'istanza di `SqlSessionFactory`.
 * 
 * 5. Nella prima verifica, viene controllato se l'istanza di
 * `SqlSessionFactory` è già stata creata. Se lo è, viene restituita
 * direttamente.
 * 
 * 6. Se l'istanza non è stata ancora creata, viene acquisito il lock sulla
 * classe `SqlSessionFactoryManager` per evitare che più thread creino più
 * istanze contemporaneamente.
 * 
 * 7. All'interno della sezione critica, viene effettuata una seconda verifica
 * per assicurarsi che nessun altro thread abbia creato un'istanza di
 * `SqlSessionFactory` durante l'attesa del lock.
 * 
 * 8. Se l'istanza non è ancora stata creata, viene letto il file di
 * configurazione `mybatis-config.xml` tramite
 * `Resources.getResourceAsStream(resource)` per ottenere il flusso di input.
 * 
 * 9. Utilizzando il `SqlSessionFactoryBuilder`, viene creato un nuovo oggetto
 * `SqlSessionFactory` chiamando il metodo `build(inputStream)`.
 * 
 * 10. Infine, l'istanza di `SqlSessionFactory` appena creata viene assegnata
 * alla variabile `sqlSessionFactory` e restituita.
 * 
 * Questo approccio garantisce che un'unica istanza di `SqlSessionFactory` venga
 * creata e utilizzata in tutto l'applicativo, evitando la creazione di istanze
 * multiple che potrebbero causare problemi di prestazioni o inconsistenze nella
 * connessione al database.
 */