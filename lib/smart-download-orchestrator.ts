/**
 * DownThemAll! Smart Download Orchestrator
 * AI-powered download queue management with intelligent optimization
 */

import { EventEmitter } from 'events';
import { PDFProcessor, PDFProcessingOptions } from './pdf-processor';
import { AIAnalysisEngine, ContentAnalysis, VisualizationData } from './ai-analysis-engine';

export interface SmartDownloadConfig {
  maxConcurrent: number;
  enableAIOptimization: boolean;
  enableContentAnalysis: boolean;
  autoProcessPDFs: boolean;
  generateVisualizations: boolean;
  compressionLevel: 'none' | 'low' | 'medium' | 'high' | 'maximum';
  ocrEnabled: boolean;
  ocrLanguages: string[];
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
}

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  size?: number;
  type: 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  metadata: DownloadMetadata;
  status: 'queued' | 'downloading' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: DownloadProgress;
  aiAnalysis?: ContentAnalysis;
  visualizations?: VisualizationData;
  processedFiles?: ProcessedFile[];
}

export interface DownloadMetadata {
  referrer?: string;
  userAgent?: string;
  cookies?: string;
  headers?: Record<string, string>;
  expectedSize?: number;
  contentType?: string;
  lastModified?: Date;
  etag?: string;
  category?: string;
  project?: string;
}

export interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  eta: number; // seconds
  startTime: Date;
  resumeCount: number;
}

export interface ProcessedFile {
  id: string;
  originalFile: string;
  processedFile: string;
  type: 'compressed' | 'ocr-text' | 'merged' | 'analyzed' | 'visualization';
  size: number;
  processingTime: number;
  metadata: Record<string, any>;
}

export interface QueueOptimization {
  recommendedOrder: string[];
  estimatedTotalTime: number;
  bandwidthAllocation: BandwidthAllocation[];
  priorityAdjustments: PriorityAdjustment[];
  batchSuggestions: BatchSuggestion[];
}

export interface BandwidthAllocation {
  downloadId: string;
  allocatedBandwidth: number; // percentage
  reason: string;
}

export interface PriorityAdjustment {
  downloadId: string;
  originalPriority: string;
  suggestedPriority: string;
  reason: string;
  confidence: number;
}

export interface BatchSuggestion {
  downloadIds: string[];
  batchType: 'similar-content' | 'same-domain' | 'related-files' | 'size-optimized';
  reason: string;
  estimatedTimeReduction: number;
}

export interface SmartDownloadStats {
  totalDownloads: number;
  completedDownloads: number;
  failedDownloads: number;
  totalSize: number;
  downloadedSize: number;
  averageSpeed: number;
  totalTime: number;
  compressionSavings: number;
  aiProcessingTime: number;
  visualizationsGenerated: number;
}

export class SmartDownloadOrchestrator extends EventEmitter {
  private config: SmartDownloadConfig;
  private downloads = new Map<string, DownloadItem>();
  private activeDownloads = new Set<string>();
  private pdfProcessor: PDFProcessor;
  private aiEngine: AIAnalysisEngine;
  private stats: SmartDownloadStats;
  private optimizationEngine: DownloadOptimizationEngine;

  constructor(config: SmartDownloadConfig) {
    super();
    this.config = config;
    this.pdfProcessor = new PDFProcessor();
    this.aiEngine = new AIAnalysisEngine({
      modelType: 'hybrid',
      enableDeepAnalysis: config.enableContentAnalysis,
      generateVisualizations: config.generateVisualizations,
      analysisDepth: config.analysisDepth,
      languages: config.ocrLanguages
    });
    this.optimizationEngine = new DownloadOptimizationEngine();
    this.stats = this.initializeStats();
    this.setupEventHandlers();
  }

  /**
   * Add downloads with intelligent analysis and optimization
   */
  async addDownloads(urls: string[], options: Partial<DownloadItem> = {}): Promise<string[]> {
    const downloadIds: string[] = [];
    
    for (const url of urls) {
      const downloadId = this.generateDownloadId();
      const downloadItem = await this.createDownloadItem(downloadId, url, options);
      
      this.downloads.set(downloadId, downloadItem);
      downloadIds.push(downloadId);
      
      this.emit('download-added', { downloadId, item: downloadItem });
    }

    // Optimize queue if AI optimization is enabled
    if (this.config.enableAIOptimization) {
      const optimization = await this.optimizeQueue();
      this.emit('queue-optimized', optimization);
    }

    // Start processing queue
    this.processQueue();
    
    return downloadIds;
  }

  /**
   * Optimize download queue using AI
   */
  async optimizeQueue(): Promise<QueueOptimization> {
    const queuedDownloads = Array.from(this.downloads.values())
      .filter(item => item.status === 'queued');

    if (queuedDownloads.length === 0) {
      return {
        recommendedOrder: [],
        estimatedTotalTime: 0,
        bandwidthAllocation: [],
        priorityAdjustments: [],
        batchSuggestions: []
      };
    }

    return await this.optimizationEngine.optimizeQueue(
      queuedDownloads,
      this.config,
      this.stats
    );
  }

  /**
   * Process download queue with intelligent scheduling
   */
  private async processQueue(): Promise<void> {
    while (this.activeDownloads.size < this.config.maxConcurrent) {
      const nextDownload = this.selectNextDownload();
      if (!nextDownload) break;

      this.startDownload(nextDownload.id);
    }
  }

  /**
   * Start individual download with processing pipeline
   */
  private async startDownload(downloadId: string): Promise<void> {
    const download = this.downloads.get(downloadId);
    if (!download || download.status !== 'queued') return;

    this.activeDownloads.add(downloadId);
    download.status = 'downloading';
    download.progress.startTime = new Date();

    this.emit('download-started', { downloadId, download });

    try {
      // Phase 1: Download file
      const file = await this.downloadFile(download);
      
      // Phase 2: Process file if needed
      if (this.shouldProcessFile(download)) {
        download.status = 'processing';
        this.emit('download-processing', { downloadId, download });
        
        await this.processDownloadedFile(download, file);
      }

      // Phase 3: Complete download
      download.status = 'completed';
      this.activeDownloads.delete(downloadId);
      this.updateStats(download);
      
      this.emit('download-completed', { downloadId, download });
      
      // Continue processing queue
      this.processQueue();
      
    } catch (error) {
      download.status = 'failed';
      this.activeDownloads.delete(downloadId);
      
      this.emit('download-failed', { downloadId, download, error });
      
      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Process downloaded file with AI analysis
   */
  private async processDownloadedFile(download: DownloadItem, file: File): Promise<void> {
    const processedFiles: ProcessedFile[] = [];
    
    try {
      // PDF Processing
      if (download.type === 'pdf' && this.config.autoProcessPDFs) {
        const pdfOptions: PDFProcessingOptions = {
          enableOCR: this.config.ocrEnabled,
          ocrLanguage: this.config.ocrLanguages[0] || 'eng',
          compressionLevel: this.config.compressionLevel as any,
          enableAnalysis: this.config.enableContentAnalysis,
          generateMindmap: this.config.generateVisualizations,
          generateFlowchart: this.config.generateVisualizations,
          outputFormat: 'json',
          preserveMetadata: true
        };

        const analysisResult = await this.pdfProcessor.processSinglePDF(file, pdfOptions);
        download.aiAnalysis = this.convertPDFAnalysisToContentAnalysis(analysisResult);

        // Generate compressed version if requested
        if (this.config.compressionLevel !== 'none') {
          const compressedFile = await this.pdfProcessor.compressPDF(
            file,
            this.config.compressionLevel as any
          );
          
          processedFiles.push({
            id: `${download.id}_compressed`,
            originalFile: download.filename,
            processedFile: `${download.filename}_compressed.pdf`,
            type: 'compressed',
            size: compressedFile.size,
            processingTime: Date.now() - download.progress.startTime.getTime(),
            metadata: { compressionRatio: file.size / compressedFile.size }
          });
        }
      }

      // AI Content Analysis for all file types
      if (this.config.enableContentAnalysis && this.canAnalyzeContent(download.type)) {
        const content = await this.extractTextContent(file, download.type);
        
        if (content.length > 0) {
          download.aiAnalysis = await this.aiEngine.analyzeContent(content, {
            title: download.filename,
            contentType: download.type,
            metadata: download.metadata
          });

          // Generate visualizations if requested
          if (this.config.generateVisualizations) {
            download.visualizations = await this.aiEngine.generateVisualizations(
              download.aiAnalysis,
              content,
              {
                maxDepth: 3,
                minImportance: 0.3,
                includeKeywords: true,
                visualStyle: 'hierarchical',
                colorScheme: 'category-based'
              },
              {
                includeDecisionPoints: true,
                showDataFlow: true,
                includeTimeline: false,
                complexity: 'detailed',
                layout: 'top-down'
              }
            );

            processedFiles.push({
              id: `${download.id}_visualizations`,
              originalFile: download.filename,
              processedFile: `${download.filename}_visualizations.json`,
              type: 'visualization',
              size: JSON.stringify(download.visualizations).length,
              processingTime: Date.now() - download.progress.startTime.getTime(),
              metadata: {
                mindmapNodes: download.visualizations.mindmap.metadata.totalNodes,
                flowchartElements: download.visualizations.flowchart.metadata.totalNodes
              }
            });
          }
        }
      }

      download.processedFiles = processedFiles;
      this.emit('file-processed', { downloadId: download.id, processedFiles });
      
    } catch (error) {
      this.emit('processing-error', { downloadId: download.id, error });
      // Continue with download completion even if processing fails
    }
  }

  /**
   * Get comprehensive download statistics
   */
  getStats(): SmartDownloadStats {
    return { ...this.stats };
  }

  /**
   * Get download by ID
   */
  getDownload(downloadId: string): DownloadItem | undefined {
    return this.downloads.get(downloadId);
  }

  /**
   * Get all downloads with optional filtering
   */
  getDownloads(filter?: {
    status?: DownloadItem['status'];
    type?: DownloadItem['type'];
    priority?: DownloadItem['priority'];
    tags?: string[];
  }): DownloadItem[] {
    let downloads = Array.from(this.downloads.values());
    
    if (filter) {
      if (filter.status) {
        downloads = downloads.filter(d => d.status === filter.status);
      }
      if (filter.type) {
        downloads = downloads.filter(d => d.type === filter.type);
      }
      if (filter.priority) {
        downloads = downloads.filter(d => d.priority === filter.priority);
      }
      if (filter.tags && filter.tags.length > 0) {
        downloads = downloads.filter(d => 
          filter.tags!.some(tag => d.tags.includes(tag))
        );
      }
    }
    
    return downloads;
  }

  /**
   * Pause download
   */
  pauseDownload(downloadId: string): boolean {
    const download = this.downloads.get(downloadId);
    if (download && download.status === 'downloading') {
      download.status = 'paused';
      this.activeDownloads.delete(downloadId);
      this.emit('download-paused', { downloadId, download });
      return true;
    }
    return false;
  }

  /**
   * Resume download
   */
  resumeDownload(downloadId: string): boolean {
    const download = this.downloads.get(downloadId);
    if (download && download.status === 'paused') {
      download.status = 'queued';
      download.progress.resumeCount++;
      this.emit('download-resumed', { downloadId, download });
      this.processQueue();
      return true;
    }
    return false;
  }

  /**
   * Cancel download
   */
  cancelDownload(downloadId: string): boolean {
    const download = this.downloads.get(downloadId);
    if (download) {
      download.status = 'failed';
      this.activeDownloads.delete(downloadId);
      this.emit('download-cancelled', { downloadId, download });
      return true;
    }
    return false;
  }

  // Private helper methods
  private generateDownloadId(): string {
    return `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async createDownloadItem(
    id: string,
    url: string,
    options: Partial<DownloadItem>
  ): Promise<DownloadItem> {
    const filename = options.filename || this.extractFilenameFromUrl(url);
    const type = this.detectFileType(filename, url);
    
    return {
      id,
      url,
      filename,
      type,
      priority: options.priority || 'medium',
      tags: options.tags || [],
      metadata: options.metadata || {},
      status: 'queued',
      progress: {
        downloaded: 0,
        total: 0,
        percentage: 0,
        speed: 0,
        eta: 0,
        startTime: new Date(),
        resumeCount: 0
      }
    };
  }

  private detectFileType(filename: string, url: string): DownloadItem['type'] {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': case 'webp':
        return 'image';
      case 'mp4': case 'avi': case 'mkv': case 'mov': case 'wmv': case 'flv': case 'webm':
        return 'video';
      case 'mp3': case 'wav': case 'flac': case 'aac': case 'ogg': case 'm4a':
        return 'audio';
      case 'doc': case 'docx': case 'txt': case 'rtf': case 'odt': case 'md':
        return 'document';
      case 'zip': case 'rar': case '7z': case 'tar': case 'gz': case 'bz2':
        return 'archive';
      default:
        return 'other';
    }
  }

  private extractFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'download';
      return decodeURIComponent(filename);
    } catch {
      return 'download';
    }
  }

  private initializeStats(): SmartDownloadStats {
    return {
      totalDownloads: 0,
      completedDownloads: 0,
      failedDownloads: 0,
      totalSize: 0,
      downloadedSize: 0,
      averageSpeed: 0,
      totalTime: 0,
      compressionSavings: 0,
      aiProcessingTime: 0,
      visualizationsGenerated: 0
    };
  }

  private setupEventHandlers(): void {
    this.pdfProcessor.on('processing-complete', (data) => {
      this.emit('pdf-processing-complete', data);
    });

    this.aiEngine.on('analysis-complete', (data) => {
      this.stats.aiProcessingTime += Date.now() - data.startTime || 0;
      this.emit('ai-analysis-complete', data);
    });

    this.aiEngine.on('visualization-complete', (data) => {
      this.stats.visualizationsGenerated++;
      this.emit('visualization-complete', data);
    });
  }

  // Additional helper methods would be implemented here...
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    this.pdfProcessor.destroy();
    this.aiEngine.clearCaches();
    this.downloads.clear();
    this.activeDownloads.clear();
  }
}

/**
 * Download optimization engine for AI-powered queue management
 */
class DownloadOptimizationEngine {
  async optimizeQueue(
    downloads: DownloadItem[],
    config: SmartDownloadConfig,
    stats: SmartDownloadStats
  ): Promise<QueueOptimization> {
    // Implement sophisticated queue optimization logic
    // This would use machine learning models to optimize download order
    
    return {
      recommendedOrder: downloads.map(d => d.id),
      estimatedTotalTime: downloads.length * 30, // placeholder
      bandwidthAllocation: [],
      priorityAdjustments: [],
      batchSuggestions: []
    };
  }
}